
// implement google spdy? adaptor














// takes these two and exposes a common method to define an api
// presets for which HTTP verb to use depending on words
// hooks for everything

var api = {};

api.transports = {
	http: {
		_extractParams: function(req){
			var params = {};
			var paramSources = [req.params, req.query, req.body];
			for( var i = 0; i < paramSources.length; i++ ){
				for( var key in paramSources[i] ){
					params[key] = paramSources[i][key];
				}
			}
			return params;
		},
		_normalizeRoute: function(route){
			// TODO: test and make sure this is a string
			return '/' + route.toLowerCase().replace('.','/');
		},
		_pickHttpMethod: function(route){
			var method = 'get';
			if( route.indexOf('save') != -1 || route.indexOf('create') != -1 || route.indexOf('update') != -1 ){
				method = 'post'
			}else if( route.indexOf('delete') != -1 || route.indexOf('remove') != -1 ){
				method = 'del';
			}
			return method;
		},
		route: function(route, handler, options){
			// TODO: test and make sure route is a string and handler is a function
			// TODO: inject session information into handler

			// apply callback with session and remote args and optional flag 'http'
			// and a sendResponse function that will respond appropriately
			route = api.transports.http._normalizeRoute( route );
			var method = options.http && options.http.method ? options.http.method : api.transports.http._pickHttpMethod( route );
			console.log( 'adding http ' + method + ' ' + route );
			api.transports.http.host[method](route, function(req, res){
				var params = api.transports.http._extractParams(req);
				handler(params, function(data, err){
					api.transports.http.respond(res, data, err);
				},{ 
					req: req 
				});
			});
		},
		respond: function(res, data, err){
			if(data){
				res.json(data);
			}else if(err){
				res.json(err);
			}else{
				res.json({});
			}
		}
	}
	,now: {
		_normalizeRoute: function(route){
			return route.replace('/','.');
		},
		route: function(route, handler, options){
			route = api.transports.now._normalizeRoute(route);
			console.log( 'adding now route: ' + route );
			api.transports.now.host.now[route] = function(params, callback){
				var n = this.now; // TODO: DO WE NEED TO PASS IN NOW?
				handler(params, function(data, err){
					api.transports.now.respond(n, callback, data, err);
				},{
					client: n
				});
			};
		},
		respond: function(n, callback, data, err){
			// api.transports.now.host
			if( typeof callback == 'function' ){
				callback(data, err);
			}
		}
	}
};

api.use = function(type, transport){
	if( api.transports[type] ){
		api.transports[type].host = transport;
	}
	return api;
};

api.map = function(route, handler, options){
	for( var key in api.transports ){
		if( api.transports[key].host ){
			api.transports[key].route( route, handler, options );
		}
	}
	return api;
};

module.exports = api;