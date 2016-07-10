var albumPicasso = {
    title: 'The House Colors',
    artist: 'Pablo My Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21' },
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15' }
    ]
};


var createSongRow = function (songNumber, songName, songLength) {
    var template =  
            '<tr class="album-view-song-item">'
            + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            + ' <td class="song-item-title">' + songName + '</td>'
            + ' <td class="song-item-duration">' + songLength + '</td>'
            + '</tr>'
            ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var $songItem = $(this);
         
        if (currentlyPlayingSong === null) {
            //no song playing 
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = $songItem.attr('data-song-number');
        } else if (currentlyPlayingSong === $songItem.attr('data-song-number')) {
            //clicked again on playing song 
            $songItem.html(playButtonTemplate);
            currentlyPlayingSong = null;

        } else if (currentlyPlayingSong !== $songItem.attr('data-song-number')) {
            //switch songs
            //go get current song
            var $currentlyPlayingSongElement = $('td[data-song-number="' + currentlyPlayingSong + '"]');
            //turn off the current song
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));

            //turn on new
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = $songItem.attr('data-song-number');
        }
        
    };
    
    //handle mouseover and mouseleave
    var onHover = function(event){
        //if this isn't the playing song, change to play button on hover
        if ($(this).find('.song-item-number').attr('data-song-number') !== currentlyPlayingSong){
            $(this).find('.song-item-number').html(playButtonTemplate);
        }
    };
    var offHover = function(event){
        var songItemNumber = $(this).find('.song-item-number').attr('data-song-number');
        
        //make song number reappear
        if (songItemNumber !== currentlyPlayingSong){
            $(this).find('.song-item-number').html(songItemNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    
    return $row;
};

var setCurrentAlbum = function(album) {
     
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
 
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
 

    $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

//button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;
 
$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
});