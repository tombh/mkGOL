//activate requestAnimFrame shim
window.requestFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


requirejs.config({
  baseUrl: './js/',
  paths: {
    jquery     : 'vendor/jquery-1.8.3.min',
    underscore : 'vendor/lodash',
    backbone   : 'vendor/backbone',
    base       : 'lib/base',
    view       : 'lib/view',
    jgol       : 'lib/jgol',
    config     : 'config'
  },
  // For easier development, disable browser caching
  // Of course, this should be removed in a production environment
  urlArgs: 'bust=' +  (new Date()).getTime()
});

var dependencies = [
  'config',
  'base',
  'views/ui',
  'models/status',
  'views/status',
  'models/score',
  'views/score',
  'models/cursor',
  'views/cursor',
  'models/universe',
  'views/universe',
  'views/feedback'
];

// Bootstrap the application
require(dependencies,
  function (config, Base, UI, StatusModel, StatusView, ScoreModel, ScoreView, CursorModel, CursorView, UniverseModel, UniverseView, FeedbackView) {

    $('#primary').css({
      width : (config.x * config.scale) + 60,
    });

    $('#wrapper').css({
      width : config.x * config.scale,
      height : config.y * config.scale
    });

    var ui = new UI(),
        status = new StatusView({
          model : new StatusModel(config)
        }),
        score = new ScoreView({
          model : new ScoreModel(config)
        }),
        cursor = new CursorView({
          model : new CursorModel(config)
        }),
        universe = new UniverseView({
          model : new UniverseModel(config)
        }),
        feedback = new FeedbackView();

});