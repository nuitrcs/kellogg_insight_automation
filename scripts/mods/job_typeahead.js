// Constructing the suggestion engine
tilde.occupations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('n'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    //identify: function(obj){ return obj.n; },
    local: tilde.occupations
});

tilde.occupations.initialize()

// Initializing the typeahead
$('#job_dropdown .typeahead').typeahead({
    hint: true,
    highlight: true, /* Enable substring highlighting */
    minLength: 1 /* Specify minimum characters required for showing suggestions */
},
{
    name: 'occupations',
    displayKey: 'n',
    source: tilde.occupations,
    templates: {
        empty: [
          '<div class="empty-message">',
            'Unable to find any occupations with current query, please try again',
          '</div>'
        ].join('\n')
      }
});

$('#job_dropdown .typeahead').bind('typeahead:selected', function(obj, datum, name) {      
    var selection = datum;
    console.log(selection)
    selection = tilde.query.select('auto_data',selection.c)
    var similars = tilde.query.selectAll('auto_data',selection.s)
    console.log(similars)
});

// https://twitter.github.io/typeahead.js/examples/
// https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#custom-events
// https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-typeahead.php