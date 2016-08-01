define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        reactDemoActivationData: parseInt((Math.random()) * 100, 10),
        activate: function () {
            var reactDemoRouteData = this.reactDemoActivationData;
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true },
                {
                    route: ':randomData/reactdemo',
                    moduleId: 'viewmodels/reactdemo',
                    title: 'React Demo',
                    hash: '#' + reactDemoRouteData + '/reactdemo',
                    nav: true,
                    react: true
                }
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});