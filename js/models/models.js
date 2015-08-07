App.User = DS.Model.extend({
    name: DS.attr('string')
});


App.ApplicationAdapter = DS.FixtureAdapter.extend();



App.User.FIXTURES = [
    {
        id: 1,
        name: 'Player of doom'
    },
    {
        id: 2,
        name: 'Luzifer'
    },
    {
        id: 3,
        name: 'Doomsday'
    }
];