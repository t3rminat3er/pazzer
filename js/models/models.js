App.User = DS.Model.extend({
    name: DS.attr('string')
});

App.Match = DS.Model.extend({
    title: DS.attr('string')
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Match.FIXTURES = [
 {
     id: 1,
     title: 'Match of doom'
 },
 {
     id: 2,
     title: 'Match of even doomer'
 },
 {
     id: 3,
     title: 'Doomest Match!'
 }
];

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