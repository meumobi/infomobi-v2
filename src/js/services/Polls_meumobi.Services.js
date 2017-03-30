(function() {
	'use strict';

	angular
	.module('meumobi.Polls', [])
	.provider('Poll', Poll);
	
	function Poll() {
		this.$get = function($q, $rootScope, translateFilter, UtilsService, API, $log, $http, meuCordova, meuCloud) {
			var api = {};
			var polls = {};
			/**
			* Api methods, available only on the inside the service
			*/
			
			//get localstorage polls
			api.polls = function() {
				if (!Object.keys(polls).length && localStorage['polls'])
					polls = JSON.parse(localStorage['polls']);
				return polls;
			},
			//add file to localstorage
			api.addPoll = function(poll) {
				polls[poll._id] = poll;
				localStorage['polls'] = JSON.stringify(polls);
			},
			api.removePolls = function() {
				
			},
			api.vote = function() {
				
			},
			api.hasExpired = function(date) {
				var now = Date.now();
				var end_date = date * 1000; // convert sec. to ms
				var hasExpired = (now - end_date) > 0; 
				
				return hasExpired;
			},
			api.hasVoted = function(poll) {
				var hasVoted = poll.voted != null || !!api.polls()[poll._id];

				return hasVoted;
			},
			api.paramify = function(poll) {
				var values = {};
				var obj = {};

				values.value = poll.values;
				obj.params = values;
				obj.id = poll._id;

				return obj;
			},
			api.computeResults = function(poll) {
				var results = [];
				var result = {};
				var total = api.totalVotes(poll);

				for (var x in poll.results) {
					/**
					* Should ignore if value is "_"
					* For more details see https://github.com/meumobi/sitebuilder/issues/351
					*/
					if (!isNaN(poll.results[x].value)) {
						result = poll.results[x];
						result["myVote"] = (poll.voted != null) ? poll.voted.values.hasOwnProperty(x): false;
						result["label"] = poll.options[result.value];
						result["ratio"] = (total != 0) ? parseFloat((poll.results[x].votes / total) * 100).toFixed(2) + "%" : "0%";
						results.push(result);
					}
				};

				return results;
			},
			api.totalVotes = function(poll) {
				var total = 0;
				for (var x in poll.results) {
					total += poll.results[x].votes;
				}

				return total;
			}
			/**
			* Service methods, that are public and available for any resource
			*/
			return {
				statuses: {
					open: 'open',
					closed: 'closed',
					voted: 'voted'
				},
				get: function(poll) {
					var status = this.getStatus(poll);
					//load poll from localstorage if voted but feed hasn't been reloaded from server
					if (status == this.statuses.voted && !!api.polls()[poll._id]) {
						poll = api.polls()[poll._id];
					} else {
						poll.status = status;
						poll.total = api.totalVotes(poll);
					}
					if (poll.status !== this.statuses.open) {
						poll.results = api.computeResults(poll);
					}
					return poll;
				},
				getStatus: function(poll) {
					var statuses = this.statuses;
					
					var status = statuses.open;
					if (api.hasExpired(poll.end_date)) {
						status = statuses.closed;
					} else if (api.hasVoted(poll)) {
						status = statuses.voted;
					}
					$log.debug("Get Status: " + status);
					return status;
				},
				vote: function(poll) {
          var statuses = this.statuses;
          $log.debug(poll);
          
          return $q(function(resolve, reject) {

  					var vote = {
  						success: function(response) {
                $log.debug(response);
                
                if (response.data.errors) {
                  reject(response.data);
                } else {
    							meuCordova.dialogs.toast(translateFilter("poll.vote.Success"));
    							poll.status = statuses.voted;
    							poll.total = api.totalVotes(response.data);
    							poll.results = api.computeResults(response.data);
    							poll.voted = response.data.voted;
    							poll.status = statuses.voted;
    							api.addPoll(poll); 
    							resolve(poll);
                }
  						},
  						error: function(response) {
  							reject(response.data);
  						}
  					};

  					meuCloud.API.Poll.submit(api.paramify(poll))
            .then(vote.success)
            .catch(vote.error);
          });
				}
			}
		}
	}
})();
