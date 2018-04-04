// Constructing the suggestion engine
tilde.occupations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('n'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    identify: function(obj){ return obj.n; },
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
            "No results, try something else...",
          '</div>'
        ].join('\n')
      }
});

$('#job_dropdown .typeahead').bind('typeahead:selected', function(obj, datum, name) {  
    if (tilde.unlocked) {
        tilde.unlocked = false
        tilde.current_selection = datum
        tilde.query.prepareData()
        $('input').blur()
    }    
    
});

// https://twitter.github.io/typeahead.js/examples/
// https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#custom-events
// https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-typeahead.php