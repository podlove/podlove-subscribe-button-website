/* globals $:false */
'use strict';

// Todo: refactor event listener functions
// Todo: write docs
// Todo: write tests
$( document ).ready( function () {

  window.podcastData = {
    'title': 'Newz of the World',
    'subtitle': 'Tim and Mark talk about the Newz™',
    'description': 'Newz of the World is a weekly show about world news. Mark Fonseca Rendeiro and Tim Pritlove come together to present interesting reports and discuss their aspects and possible consequences. Newz of the world wants to be an alternative window to the common media flow and cherry picks interesting developments for you.',
    'cover': 'http://meta.metaebene.me/media/newz/newz-logo-600x600.jpg',
    'feeds': [
      {
        'type': 'audio',
        'format': 'mp3',
        'url': 'http://newz-of-the-world.com/feed/mp3',
        'variant': 'high'
      },
      {
        'type': 'audio',
        'format': 'aac',
        'url': 'http://newz-of-the-world.com/feed/mp4',
        'variant': 'high',
        'directory-url-itunes': 'https://itunes.apple.com/de/podcast/newz-of-the-world/id492588543'
      },
      {
        'type': 'audio',
        'format': 'ogg',
        'url': 'http://newz-of-the-world.com/feed/ogg',
        'variant': 'high'
      },
      {
        'type': 'audio',
        'format': 'opus',
        'url': 'http://newz-of-the-world.com/feed/opus',
        'variant': 'high'
      }
    ]
  };

  var $button = $( '#live-button' ),
    buttonConfig = {
      'data-json-data': 'podcastData',
      'data-language': 'en',
      'data-size': 'big',
      'data-color': '#469cd1',
      'data-format': 'cover',
      'data-style': 'filled'
    },
    $generatorModal = $( '#generator-modal' ),
    $generatorSubmit = $( '#generator-submit' ),
    $openGeneratorButton = $( '#generator-open' );

  function generateScript ( object ) {
    var script = document.createElement( 'script' );

    script.type = 'text/javascript';
    script.src = 'https://cdn.podlove.org/subscribe-button/javascripts/app.js';
    script.className = 'podlove-subscribe-button';

    $.each( object, function ( key, value ) {
      script.setAttribute( key, value );
    } );
    return script;
  }

  function addButton () {
    var script = generateScript( buttonConfig );
    $button.html( script );
  }

  function changeButtonStyle ( style ) {
    buttonConfig[ 'data-style' ] = style;
    addButton();
  }

  function changeButtonColor ( color ) {
    buttonConfig[ 'data-color' ] = color;
    addButton();
  }

  function changeButtonFormat ( format ) {
    buttonConfig[ 'data-format' ] = format;
    addButton();
  }

  function changeButtonLanguage ( language ) {
    buttonConfig[ 'data-language' ] = language;
    addButton();
  }

  function changeButtonSize ( size ) {
    buttonConfig[ 'data-size' ] = size;
    addButton();
  }

  function createScriptElement () {
    var color = '',
      format = '',
      language = '',
      scriptElement = '',
      size = '',
      style = '';

    color = $('#color').val();
    format = $('input[name=format]:checked').val();
    language = $('input[name=language]:checked').val();
    size = $('input[name=size]:checked').val();
    style = $('input[name=style]:checked').val();

    scriptElement = '<script class="podlove-subscribe-button" src="http://example.com/subscribe-button/javascripts/app.js" data-language="' + language + '" data-size="' + size + '" data-json-data="podcastData" data-color="' + color + '" data-format="' + format + '" data-style="' + style + '"></script>';

    return scriptElement;
  }

  function eventTargetHandler ( e ) {
    var target, value;

    if ( typeof e.target === 'object' ) {
      target = e.target;
      if ( typeof target.value === 'string' ) {
        value = target.value;
      }
    } else {
      throw new Error( 'Input Event erroneous.' );
    }

    return value;
  }

  function closeGeneratorModal () {
    $( 'html' ).css( 'overflow', 'auto' );
    $( 'body' ).css( 'overflow', 'auto' );
    $generatorModal.removeClass( 'modal--styled' );
    window.setTimeout( function () {
      $generatorModal.removeClass( 'modal--visible' );
    }, 1000 );
  }

  function generateFeedObjectString (type, format, variant, path) {
    var feedObject = {};

    feedObject.type = type;
    feedObject.format = format;
    feedObject.variant = variant;
    feedObject.path = path;

    return feedObject;
  }

  function handleGeneratorSubmit ( e ) {
    var title = '',
      subtitle = '',
      description = '',
      pathToCover = '',
      jsonObject = {},
      feeds = [],
      feedsArray = [],
      generatedString = '',
      generatedScriptElement = '',
      $outputElement = $( '#podcast-script-creation' );

    e.preventDefault();

    title = $( '#podcast-title' ).val();
    subtitle = $( '#podcast-subtitle' ).val();
    description = $( '#podcast-description' ).val();
    pathToCover = $( '#podcast-cover' ).val();

    feeds = $( '.generator__form__feed' );

    for ( var i = 0, max = feeds.length; i < max; i += 1 ) {
      feedsArray[ i ] = generateFeedObjectString(
        $( '#podcast-feed-' + i + '-type').val(),
        $( '#podcast-feed-' + i + '-format').val(),
        $( '#podcast-feed-' + i + '-variant').val(),
        $( '#podcast-feed-' + i + '-path').val()
      );
    }

    jsonObject.title = title;
    jsonObject.subtitle = subtitle;
    jsonObject.description = description;
    jsonObject.cover = pathToCover;
    jsonObject.feeds = feedsArray;

    generatedScriptElement = createScriptElement();

    generatedString = '<script>window.podcastData=' + JSON.stringify(jsonObject) + '</script>' + generatedScriptElement + '<noscript><a href="' + feedsArray[ 0 ].path + '">Subscribe to feed</a></noscript>';

    console.log(generatedString);

    $outputElement.val(generatedString);
    $outputElement.trigger('autoresize');
  }

  function initForms () {
    // $( 'select' ).material_select();
  }

  function openGeneratorModal () {
    $( 'html' ).css( 'overflow', 'hidden' );
    $( 'body' ).css( 'overflow', 'hidden' );
    $generatorModal.addClass( 'modal--visible' );
    window.setTimeout( function () {
      $generatorModal.addClass( 'modal--styled' );
    }, 100 );
  }

  function addColorListener () {
    var $colorInput = $( '#color' );

    $colorInput.bind( 'input', function ( e ) {
      var color = eventTargetHandler( e );
      changeButtonColor( color );
    } );
  }

  function addFormatListener () {
    var $formatInput = $( 'input[name=format]' );

    $formatInput.on( 'change', function ( e ) {
      var format = eventTargetHandler( e );
      changeButtonFormat( format );
    } );
  }

  function addLanguageListener () {
    var $languageInput = $( '#language' );

    $languageInput.on( 'change', function ( e ) {
      var language = eventTargetHandler( e );
      changeButtonLanguage( language );
    } );
  }

  function addModalListener () {
    $generatorModal.on( 'click', function () {
      closeGeneratorModal();
    } ).children().on( 'click', function ( e ) {
      e.stopPropagation();
    } );

    $openGeneratorButton.on( 'click', function () {
      openGeneratorModal();
    } );

    $generatorSubmit.on( 'click', function ( e ) {
      handleGeneratorSubmit( e );
    } );

    $( document ).on( 'keyup', function ( e ) {
      if (e.keyCode === 27 ) {
        closeGeneratorModal();
      }
    });
  }

  function addSizeListener () {
    var $sizeInput = $( 'input[name=size]' );

    $sizeInput.on( 'change', function ( e ) {
      var size = eventTargetHandler( e );
      changeButtonSize( size );
    } );
  }

  function addStyleListener () {
    var $styleInput = $( 'input[name=style]' );

    $styleInput.on( 'change', function ( e ) {
      var style = eventTargetHandler( e );
      changeButtonStyle( style );
    } );
  }

  function init () {
    addButton( 'red' );
    addColorListener();
    addStyleListener();
    addFormatListener();
    addLanguageListener();
    addModalListener();
    addSizeListener();
    initForms();
  }

  init();

} );

//# sourceMappingURL=main.js.map
