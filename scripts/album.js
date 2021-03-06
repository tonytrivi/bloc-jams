var createSongRow = function (songNumber, songName, songLength) {
    var template =  
            '<tr class="album-view-song-item">'
            + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            + ' <td class="song-item-title">' + songName + '</td>'
            + ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
            + '</tr>'
            ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var $songItem = $(this);
        var dataSongNumberInt = parseInt($songItem.attr('data-song-number'));
         
        if (currentlyPlayingSongNumber === null) {
            //initial play - no song playing 
            $songItem.html(pauseButtonTemplate);
            
            //set volume controller
            var $volumeSeekBar = $('.volume .seek-bar');
            updateSeekPercentage($volumeSeekBar, (currentVolume / 100));
            
            setSong(dataSongNumberInt);
            currentSoundFile.play();
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
     
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
            updateSeekBarWhileSongPlays();
            
            
            
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
    
    //set song total duration
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
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

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}


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

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
             
            //update the displayed song time elapsed
            setCurrentTimeInPlayerBar(currentSoundFile.getTime());
             
         });
     }
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;
         
         var $volumeParent = $(this).parents('.volume');
         if($volumeParent.length){
             //set volume
             setVolume(seekBarFillRatio * 100);
         }
         else {
             //set place in song
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         }
         
         updateSeekPercentage($(this), seekBarFillRatio);
         
     });
     
     $seekBars.find('.thumb').mousedown(function () {
         var $seekBar = $(this).parent();
         
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
             } else {
                setVolume(seekBarFillRatio);
             }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
         
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
             
         });
         
     });
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
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    
};

var previousSong = function(){
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
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    
};

var togglePlayFromPlayerBar = function() {
    var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
    
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

var setCurrentTimeInPlayerBar = function (currentTime) {
    $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function (totalTime) {
    $('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function (timeInSeconds) {
    var timeSecsFloat = parseFloat(timeInSeconds);
    var formattedTime = '';
    
    if (timeSecsFloat < 10) {
        formattedTime += '00:0' + Math.floor(timeSecsFloat);
    }
    else if (timeSecsFloat < 60) {
        formattedTime += '00:' + Math.floor(timeSecsFloat);
    }
    else {
        var min = timeSecsFloat/60;
        var sec = Math.floor((Math.abs(min) * 60) % 60);
        
        if(sec < 10){
            formattedTime += Math.floor(min) + ':0' + sec;
        }
        else {
            formattedTime += Math.floor(min) + ':' + sec;
        }
        
    }
    
    return formattedTime;
    
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
    setupSeekBars();
});