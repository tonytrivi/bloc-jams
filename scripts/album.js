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
        var $dataSongNumberInt = parseInt($songItem.attr('data-song-number'));
         
        if (currentlyPlayingSongNumber === null) {
            //no song playing 
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = $dataSongNumberInt;
            currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
            
            updatePlayerBarSong();
            
     
        } else if (currentlyPlayingSongNumber === $dataSongNumberInt) {
            //clicked again on playing song 
            $songItem.html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            
            $('.main-controls .play-pause').html(playerBarPlayButton);

        } else if (currentlyPlayingSongNumber !== $dataSongNumberInt) {
            //switch songs
            //get current song
            var $currentlyPlayingSongElement = $('td[data-song-number="' + currentlyPlayingSongNumber + '"]');
            //turn off the current song
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));

            //turn on new
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = parseInt($songItem.attr('data-song-number'));
            currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
            
            updatePlayerBarSong();
            //console.log(currentSongFromAlbum.title);
        }
        
    };
    
    //handle mouseover and mouseleave
    var onHover = function(event){
        //if this isn't the playing song, change to play button on hover
        if (parseInt($(this).find('.song-item-number').attr('data-song-number')) !== currentlyPlayingSongNumber){
            $(this).find('.song-item-number').html(playButtonTemplate);
        }
    };
    var offHover = function(event){
        var songItemNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
        
        //make song number reappear
        if (songItemNumber !== currentlyPlayingSongNumber){
            $(this).find('.song-item-number').html(songItemNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    
    return $row;
};

var updatePlayerBarSong = function(){
    $(".currently-playing .song-name").text(currentSongFromAlbum.title);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var setCurrentAlbum = function(album) {
    currentAlbum = album; 
    
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

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function(){
    var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongNumber = previousSongIndex + 1;
    
    //check if we are at the end of the songs
    //increment
    if ((previousSongIndex + 1) > (currentAlbum.songs.length - 1)) {
        //change to the first song in the album
        currentSongFromAlbum = currentAlbum.songs[0];
        currentlyPlayingSongNumber = 1;
        
    } 
    else {
        //increment the song
        currentSongFromAlbum = currentAlbum.songs[(previousSongIndex + 1)];
        currentlyPlayingSongNumber = previousSongNumber + 1;
    }
    
    //turn the previous song to a number
    //turn new song to pause button
    $('td[data-song-number="' + previousSongNumber + '"]').html(previousSongNumber);
    $('td[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    
    updatePlayerBarSong();
    
};

var previousSong = function(){
    var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongNumber = previousSongIndex + 1;
    
    //check if we are at the first song
    if (previousSongIndex === 0) {
        //change to the last song in the album
        currentSongFromAlbum = currentAlbum.songs[(currentAlbum.songs.length - 1)];
        currentlyPlayingSongNumber = currentAlbum.songs.length;
        
    } 
    else {
        //decrement the song
        currentSongFromAlbum = currentAlbum.songs[(previousSongIndex - 1)];
        currentlyPlayingSongNumber = previousSongNumber - 1;
        
    }
    
    //turn the previous song to a number
    //turn new song to pause button
    $('td[data-song-number="' + previousSongNumber + '"]').html(previousSongNumber);
    $('td[data-song-number="' + currentlyPlayingSongNumber + '"]').html(pauseButtonTemplate);
    
    updatePlayerBarSong();
    
};

//button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});