(function() {
	'use strict';

	angular
	.module('meumobi.Polls')
	.provider('Poll', Poll);
	
	function Poll() {
		this.$get = function($q, $rootScope, translateFilter, UtilsService, API, $log, $http) {
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
				return false;
			},
			api.hasVoted = function(poll) {
				$log.debug("Poll is voted [Object]" + (poll.voted != null));
				$log.debug("Poll is voted [locaStorage]" + !!api.polls()[poll._id]);
				return (poll.voted != null || !!api.polls()[poll._id]);
			},
			api.paramify = function(poll) {
				var values = {};
				var obj = {};
				
				values.value = poll.values;
				obj.params = values;
				obj.id = poll._id;
				$log.debug(JSON.stringify(obj));

				return obj;
			},
			api.computeResults = function(poll) {
				var results = [];
				var result = {};
				var total = api.totalVotes(poll);
				$log.debug("Total votes: " + total);
				$log.debug(poll.voted);
				
				for (var x in poll.results) {
					result = poll.results[x];
					result["myVote"] = poll.voted.values.hasOwnProperty(x);
					result["label"] = poll.options[result.value];
					result["ratio"] = (parseInt(poll.results[x].votes) / total) * 100 + "%";
					$log.debug(result);
					results.push(result);
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
					//load poll from localstorage if needed
					if (status == this.statuses.voted && !!api.polls()[poll._id]) {
						poll = api.polls()[poll._id];
						$log.debug("Poll loaded from localStorage");
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
					return status;
				},
				vote: function(poll) {
					
					var deferred = $q.defer();
					var statuses = this.statuses;
					
					var vote = {
						success: function(response) {
							poll.status = statuses.voted;
							poll.total = api.totalVotes(response);
							poll.results = api.computeResults(response);
							poll.voted = response.voted;
							poll.status = statuses.voted;
							api.addPoll(poll); 
							$log.debug(poll);
							deferred.resolve(poll);
						},
						error: function(error) {
							$log.debug(error);
							UtilsService.toast("Erro ao enviar seu voto. Confere sua conexão e tente novamente.");
							deferred.reject(error);
						}
					};

					API.Poll.submit(api.paramify(poll), vote.success, vote.error);

					return deferred.promise;
				}
			}
		}
	}
})();
