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
        var dataSongNumberInt = parseInt($songItem.attr('data-song-number'));
         
        if (currentlyPlayingSongNumber === null) {
            //no song playing 
            $songItem.html(pauseButtonTemplate);
            setSong(dataSongNumberInt);

            updatePlayerBarSong();
            
     
        } else if (currentlyPlayingSongNumber === dataSongNumberInt) {
            //clicked again on playing song 
            if (currentSoundFile.isPaused()) {
                //start playing again
                $('.main-controls .play-pause').html(playerBarPauseButton);
                $songItem.html(pauseButtonTemplate);
                currentSoundFile.play();
            }
            else {
                //pause
                $('.main-controls .play-pause').html(playerBarPlayButton);
                $songItem.html(playButtonTemplate);
                currentSoundFile.pause();
            }

        } else if (currentlyPlayingSongNumber !== dataSongNumberInt) {
            //switch songs
            //get current song
            var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);

            //turn off the current song
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));

            //turn on new
            $songItem.html(pauseButtonTemplate);
            setSong(dataSongNumberInt);
            currentSoundFile.play();
            
            updatePlayerBarSong();
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

var setSong = function(songNumber){
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[(songNumber - 1)];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number){
    var $songnumberElement = $('td[data-song-number="' + number + '"]')
    
    return $songnumberElement;
}

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
        setSong(1);
        
    } 
    else {
        //increment the song
        setSong((previousSongNumber + 1));
    }
    
    //turn the previous song to a number
    //turn new song to pause button
    var $previousSongNumberElement = getSongNumberCell(previousSongNumber);
    var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
    
    $previousSongNumberElement.html(previousSongNumber);
    $currentSongNumberElement.html(pauseButtonTemplate);
    
    currentSoundFile.play();
    updatePlayerBarSong();
    
};

var previousSong = function() {
    var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongNumber = previousSongIndex + 1;
    
    //check if we are at the first song
    if (previousSongIndex === 0) {
        //change to the last song in the album
        setSong(currentAlbum.songs.length);

        
    } 
    else {
        //decrement the song
        setSong((previousSongNumber - 1));
    }
    
    //turn the previous song to a number
    //turn new song to pause button
    var $previousSongNumberElement = getSongNumberCell(previousSongNumber);
    var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
    
    $previousSongNumberElement.html(previousSongNumber);
    $currentSongNumberElement.html(pauseButtonTemplate);
    
    currentSoundFile.play();
    updatePlayerBarSong();
    
};

var togglePlayFromPlayerBar = function() {
    var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
    console.log(currentSoundFile);
    
    if (currentSoundFile.isPaused()) {
        $currentSongNumberElement.html(pauseButtonTemplate);
        $playerBarPlayPauseButton.html(playerBarPauseButton);
        
        currentSoundFile.play();    
    }
    else {
        $currentSongNumberElement.html(playButtonTemplate);
        $playerBarPlayPauseButton.html(playerBarPlayButton);
        
        currentSoundFile.pause();    
        
    }
};

//button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPauseButton = $('.main-controls .play-pause');
 
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
    
    
});