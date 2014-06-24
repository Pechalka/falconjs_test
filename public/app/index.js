var AutoUpdateModel = Falcon.Model.extend({
	startTraking : function(){
		var lastValue = ko.observable(ko.toJSON(this.serialize()));
        var isDirty  = ko.computed({
            read: function () {
            	return ko.toJSON(this.serialize()) !== lastValue();
            },
            write: function (newValue) {
                if (newValue) {
                    lastValue('');
                } else {
                    lastValue(ko.toJSON(this.serialize()));
                }
            },
            owner : this
        });

        ko.computed(function () {

			if (isDirty()) this.save();

	    }, this).extend({throttle: 200 });
	},
	autoUpdate : function(){
		this.on('create', function(){
		
			this.startTraking();
		
		}, this)
	}
})

var AutoUpdateCollection = Falcon.Collection.extend({
	autoUpdate : function(){
		this.on('fetch', function(){
			this.each(function(m){
				m.startTraking();
			})
		}, this);
	}
})

var Todo = AutoUpdateModel.extend({
	url : 'api/todo',
	observables : {
		title : '',
		completed : false
	},
	initialize : function(){
		this.autoUpdate();
	}
	// ,validate : function(){
	// 	return confirm('valid');
	// }
})

var Todos = AutoUpdateCollection.extend({
	model : Todo,
	initialize : function(){
		this.autoUpdate();
	}
})


var TodoView = Falcon.View.extend({
	url : 'app/templates/todo.html',
	defaults : {
		todos :  new Todos() 
	},
	observables : {
		new_title : ''
	},
	initialize : function(){
		this.todos.fetch()
	},
	add : function(){
		this.todos.create(
			new Todo({ title : this.new_title() }), {
				success : function(){
					this.new_title('')		
				}
			}, this);
		
	},
	remove : function(item){
		var accept = confirm('are you sure?');
		
		if (!accept) return;

		item.destroy({ 
			success : function(){
				this.todos.fetch()
			}
		}, this);
	}
})

var TestView = Falcon.View.extend({
	url : 'app/templates/test.html'
})

var views = {
	'todo' : TodoView,
	'test' : TestView
}

var AppView = Falcon.View.extend({
	url : 'app/templates/app.html',
	defaults : {
		views : [ 'todo', 'test']
	},
	show : function(item){
		var View = views[item];
		Falcon.apply(new View, '#container');
	},
	display : function(){
		this.show('todo')
	}
});

var view = new AppView();
Falcon.apply(view);
