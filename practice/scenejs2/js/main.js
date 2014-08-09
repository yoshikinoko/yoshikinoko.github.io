require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-1.11.1',
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        scenejs : "lib/scenejs/scenejs",
        backboneLocalstorage : "lib/backbone.localStorage"
    },
    // define library dependencies
    shim: {
        jquery: {
            exports: "$"
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        scenejs : {
            exports: "SceneJS"
        }
    }
});
define(["jquery", "backbone", "scenejs","views/WorldView"], function($, Backbone, SceneJS, WorldView) {
    // define(['backbone'], function (Backbone) {
    // console.log(Backbone === window.Backbone); // trueになる
    // console.log('called from main.js');
    // $('#info').html("hello");

  
   new WorldView();
     // console.log(view.getName());
});