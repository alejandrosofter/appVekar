applicationController = RouteController.extend({
  layoutTemplate: 'layoutApp',
      loadingTemplate: 'loaderGral',
      notFoundTemlplate: 'notFound',
//    yieldTemplates: {
//      'applicationHeader': {to: 'header'},
//      'projectSwitcher': {to: 'projectSwitcher'},
//      'applicationMainNav': {to: 'mainNav'},
//      'applicationFooter': {to: 'footer'}
//    },
      waitOn: function() {
        return [
            Meteor.subscribe('Entidades'),
            Meteor.subscribe('Lotes'),
            Meteor.subscribe('Ventas'),
            Meteor.subscribe('Fiduciarios'),
            Meteor.subscribe('Presupuestos'),
             Meteor.subscribe('Settings'),
              Meteor.subscribe('Liquidaciones'),
              Meteor.subscribe('Propietarios'),
            Meteor.subscribe('DatosMapa'),
        ];
      },
      onBeforeAction: function(pause) {
        this.render('loaderGral');
        if ( !Meteor.user() )
            {this.render('login');}
//      if (!!this.ready() && Projects.find().count() === 0)
    else        {this.next();}
      },
      action: function () {
        if (!this.ready()) {
      
          this.render('loaderGral');
        }
        else {
          this.render();

        }
      }
    });
applicationControllerMapa = RouteController.extend({
  layoutTemplate: 'layoutApp',
      loadingTemplate: 'loaderGral',
      notFoundTemlplate: 'notFound',
//    yieldTemplates: {
//      'applicationHeader': {to: 'header'},
//      'projectSwitcher': {to: 'projectSwitcher'},
//      'applicationMainNav': {to: 'mainNav'},
//      'applicationFooter': {to: 'footer'}
//    },
      waitOn: function() {
        return [
            Meteor.subscribe('Entidades'),
            Meteor.subscribe('Lotes'),
            Meteor.subscribe('Ventas'),
            Meteor.subscribe('Fiduciarios'),
            Meteor.subscribe('Presupuestos'),
             Meteor.subscribe('Settings'),
              Meteor.subscribe('Liquidaciones'),
              Meteor.subscribe('Propietarios'),
              Meteor.subscribe('DatosMapa'),
            
        ];
      },
      onBeforeAction: function(pause) {
        this.render('loaderGral');
        if ( !Meteor.user() )
            {this.render('login');}
//      if (!!this.ready() && Projects.find().count() === 0)
    else        {this.next();}
      },
      action: function () {
        if (!this.ready()) {
      
          this.render('loaderGral');
        }
        else {
          this.render();

        }
      }
    });
Router.route('inicio', {
		path: '/',
    template:"mapa",
		controller: applicationControllerMapa,
})
Router.route('liquidaciones', {
		path: '/liquidaciones',
    template:"liquidaciones",
		controller: applicationController,
})
Router.route('editarPlano', {
		path: '/editarPlano',
    template:"editarPlano",
		controller: applicationControllerMapa,
})
Router.route('informe', {
		path: '/informe',
    template:"informe",
		controller: applicationController,
})
Router.route('mapa', {
		path: '/mapa',
    template:"mapa",
		controller: applicationControllerMapa,
})
Router.route('nuevaLiquidacion', {
		path: '/nuevaLiquidacion',
    template:"nuevaLiquidacion",
		controller: applicationController,
})
Router.route('propietarios', {
		path: '/propietarios',
    template:"propietarios",
		controller: applicationController,
})
Router.route('lotes', {
		path: '/lotes',
    template:"lotes",
		controller: applicationController,
})
Router.route('nuevoLote', {
		path: '/nuevoLote',
    template:"nuevoLote",
		controller: applicationController,
})
Router.route('fiduciarios', {
		path: '/fiduciarios',
    template:"fiduciarios",
		controller: applicationController,
})
Router.route('nuevoFiduciario', {
		path: '/nuevoFiduciario',
    template:"nuevoFiduciario",
		controller: applicationController,
})
Router.route('/modificarFiduciario/:_id', {
    template: 'modificarFiduciario',
    controller: applicationController,
    data: function(){
         var sal=Fiduciarios.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('nuevoPresupuesto', {
		path: '/nuevoPresupuesto',
    template:"nuevoPresupuesto",
		controller: applicationController,
})
Router.route('/modificarPresupuesto/:_id', {
    template: 'modificarPresupuesto',
    controller: applicationController,
    data: function(){
         var sal=Presupuestos.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('/imprimirPresupuesto/:_id', {
    template: 'imprimirPresupuesto',
    controller: applicationController,
    data: function(){
         var sal=Presupuestos.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('presupuestos', {
		path: '/presupuestos',
    template:"presupuestos",
		controller: applicationController,
})

Router.route('ventas', {
		path: '/ventas',
    template:"ventas",
		controller: applicationController,
})


Router.route('/modificarVenta/:_id', {
    template: 'modificarVenta',
    controller: applicationController,
    data: function(){
         var sal=Ventas.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('/pagosVenta/:_id', {
    template: 'pagosVenta',
    controller: applicationController,
    data: function(){
			
         var sal=Ventas.findOne({_id: this.params._id});
			Session.set("venta",sal);
         return sal;
    }
});

Router.route('/modificarEntidad/:_id', {
    template: 'modificarEntidad',
    controller: applicationController,
    data: function(){
         var sal=Entidades.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});



Router.route('/modificarLote/:_id', {
    template: 'modificarLote',
    controller: applicationController,
    data: function(){
         var sal=Lotes.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});

Router.route('datosSistema', {
		path: '/datosSistema',
    template:"datosSistema",
		controller: applicationController,
})
Router.route('/modificarDatosSistema/:_id', {
    template: 'modificarDatosSistema',
    controller: applicationController,
    data: function(){
         var sal=Settings.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('importarLotes', {
		path: '/importarLotes',
    template:"importarLotes",
		controller: applicationController,
})
Router.route('entidades', {
		path: '/entidades',
    template:"entidades",
		controller: applicationController,
})
Router.route('nuevaEntidad', {
		path: '/nuevaEntidad',
    template:"nuevaEntidad",
		controller: applicationController,
})

Router.route('informeLotes', {
		path: '/informeLotes',
    template:"informeLotes",
		controller: applicationController,
})
