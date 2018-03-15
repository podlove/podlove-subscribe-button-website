/* globals $:false */
'use strict';

// Todo: refactor event listener functions
// Todo: write docs
// Todo: write tests
$( document ).ready( function () {

  window.podcastData = {
    'title': 'Podlove Test Feed',
    'subtitle': 'Use this for testing purposes only',
    'description': 'This feed is just for testing and might go away anytime. It includes all major markup and is a paged feed too.',
    'cover': 'https://meta.metaebene.me/media/podlove/podlove-logo-2.0-512x512.jpg',
    'feeds': [
      {
        'type': 'audio',
        'url': 'http://v4-feed-test.podlove.org/feed/',
        'format': '0'
      },
      {
        'type': 'audio',
        'url': 'http://v4-feed-test.podlove.org/feed/',
        'format': 'mp3'
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
    $generatorAddFeed = $( '#generator-add-feed' ),
    $generatorModal = $( '#generator-modal' ),
    $generatorSubmit = $( '#generator-submit' ),
    $openGeneratorButton = $( '#generator-open' ),
    $generatorClipboardButton = $( '#generator-copy-clipboard' );

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

  function updateButtonInfo () {
    var $iframe = $button.find( 'iframe' ),
      $widthElement = $( '#live-info-width' ),
      width = null,
      $heightElement = $( '#live-info-height' ),
      height = null;

    // to prevent info from showing false values while iframe is loading and resizing
    if ( !$iframe.width() || $iframe.width() > 200 ) {
      setTimeout( function () {
        updateButtonInfo();
      }, 2000 );
      return;
    }

    width = $iframe.width() + 'px';
    height = $iframe.height() + 'px';

    $widthElement.text( width );
    $heightElement.text( height );
  }

  function addButton () {
    var script = generateScript( buttonConfig );
    $button.html( script );
    setTimeout( function () {
      updateButtonInfo();
    }, 1200 );
  }

  function addFeedInputFields ( e ) {
    var feeds = $( '.generator__form__feed' ),
      feedsCount = feeds.length,
      $newFormElement;
    console.log(feedsCount);
    e.preventDefault();
    $newFormElement = $( '#podcast-feed-0' ).clone().attr( 'id', 'podcast-feed-' + feedsCount ).insertAfter( '#podcast-feed-' + ( feedsCount - 1 ) );
    // rename children
    $newFormElement.find( '.generator__form__select__field--type-js' ).attr( 'id', 'podcast-feed-' + feedsCount + '-type' );
    $newFormElement.find( '.generator__form__select__field--format-js' ).attr( 'id', 'podcast-feed-' + feedsCount + '-format' );
    $newFormElement.find( '.generator__form__input--path-js' ).attr( 'id', 'podcast-feed-' + feedsCount + '-path' );
    $newFormElement.find( '.generator__form__input--itunes-js' ).attr( 'id', 'podcast-feed-' + feedsCount + '-itunes' );
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

  function changeButtonImage ( image ) {
    window.podcastData.cover = image;
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
    language = $('.live__select__option:selected').val();
    size = $('input[name=size]:checked').val();
    style = $('input[name=style]:checked').val();

    scriptElement = '<script class="podlove-subscribe-button" src="https://cdn.podlove.org/subscribe-button/javascripts/app.js" data-language="' + language + '" data-size="' + size + '" data-json-data="podcastData" data-color="' + color + '" data-format="' + format + '" data-style="' + style + '"></script>';

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

  function copyToClipboard ( e ) {
    var target = e.target,
      copyTarget = target.dataset.copytarget,
      input = ( copyTarget ? document.querySelector( copyTarget ) : null ),
      $message = $( '#generator-copy-message-success');

    if ( input && input.select ) {
      input.select();

      try {
        document.execCommand( 'copy' );
        $message.addClass( 'generator__copy-message--visible' );
      } catch ( err ) {
        alert( 'Please press Ctrl/Cmd+C to copy.' );
      }

    }
  }

  function generateFeedObjectString (type, format, url, itunes) {
    var feedObject = {};

    feedObject.type = type;
    feedObject.format = format;
    feedObject.url = url;
    if ( itunes ) {
      feedObject['directory-url-itunes'] = itunes;
    }

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
      $outputElement = $( '#podcast-script-creation' ),
      $buttonCreated = $( '#generator-subscribe-button-creation' ),
      $creation = $( '#generator-creation' );

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
        $( '#podcast-feed-' + i + '-path').val(),
        $( '#podcast-feed-' + i + '-itunes' ).val()
      );
    }

    jsonObject.title = title;
    jsonObject.subtitle = subtitle;
    jsonObject.description = description;
    jsonObject.cover = pathToCover;
    jsonObject.feeds = feedsArray;

    generatedScriptElement = createScriptElement();

    generatedString = '<script>window.podcastData=' + JSON.stringify(jsonObject) + '</script>' + generatedScriptElement + '<noscript><a href="' + feedsArray[ 0 ].url + '">Subscribe to feed</a></noscript>';

    $creation.addClass( 'generator__creation--visible' );
    $outputElement.val(generatedString);
    $outputElement.trigger('autoresize');
    $outputElement.select();
    $buttonCreated.html(generatedString);
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

  function addImageListener () {
    var $imageInput = $( 'input[name=podcast-cover]' );

    $imageInput.focusout( function ( e ) {
      var image = eventTargetHandler( e );
      changeButtonImage( image );
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

    $generatorAddFeed.on( 'click', function ( e ) {
      addFeedInputFields( e );
    } );
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

  function addCopyToClipboardListener () {
    $generatorClipboardButton.on( 'click', function ( e ) {
      copyToClipboard( e );
    } );
  }

  function init () {
    addButton( 'red' );
    addColorListener();
    addStyleListener();
    addFormatListener();
    addImageListener();
    addLanguageListener();
    addModalListener();
    addSizeListener();
    addCopyToClipboardListener();
    initForms();
  }

  init();

} );
