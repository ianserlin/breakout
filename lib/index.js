module.exports = function(){

	// takes these two and exposes a common method to define an api
	// presets for which HTTP verb to use depending on words
	// hooks for everything

	var api = {};

	api.transports = {
		'http': {
			route: function(route, callback){
				function(callback, args){ .. }
				var method = route.indexOf('save') == 0 ? 'get' : route.indexOf('delete') == 0 ? 'del' : 'get';
				http[method](route, api.httpCallback(callback));
			},
			respond: function(response, err){
				// apply callback with session and remote args and optional flag 'http'
				// and a sendResponse function that will respond appropriately
				args.unshift( session );
				args.push( api.sendHttpResponse );
				args.push( 'http' );
				return function(){
					callback.apply( null, args );
				};				
			}
		},
		'now': {
			route: function(route, callback){
				function(callback, args){ .. }
				now.everyone.now[route] = api.rpcCallback(callback);
			},
			respond: function(response, err){
				api.now. ... 
			}
		}
	};

	// need a way to look up responses
	api.use = function(type, transport){
		transports[type].host = transport;
		return this;
	};

	api.listen = function(route, callback){
		for( var transport in api.transports ){
			if( transport.host ){
				transport.route( route, callback );
			}
		}
		return this;
	};

	return api;
};