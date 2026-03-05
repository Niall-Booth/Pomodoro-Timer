import { animate} from 'https://esm.sh/animejs';

//Timer Variables
let workTimer = "00:00";
let breakTimer = "00:00";
let timer = null;

//Task Variables
let tasks = {};
let currentSelectedTask;

//alarm variable
let alarm = document.getElementById("alarm");

//Reset
function reset(mode){
    clearInterval(timer);
    timer = null;
    let timerDisplay = mode == "work" ? workTimer : breakTimer;
    $("#countdown").text(timerDisplay);
    $("#start-stop-button").text("Start");
    $("title").text("My-Pomodoro");
}

//changing scene
function changeScene(currentTimerValue, mode){
    let imageNumberRemove = mode == "work" ? "2" : "1";
    let imageNumberAdd = mode == "work" ? "1" : "2";
    $(`#background-img-${imageNumberRemove}`).css("z-index", -2);
    $(`#background-img-${imageNumberAdd}`).css(
        {
            "z-index" : -3,
            "opacity" : 1
        }
    );
    animate(
        `#background-img-${imageNumberRemove}`,
        {
            opacity:0,
            duration:1000,
            ease: "out(3)",
        }
    )
    $("#timer").toggleClass("timer-work timer-break");
    $(".selector").toggleClass("work-selected break-selected");
    $("#break-button").toggleClass("break-active");
    $("#work-button").toggleClass("work-active");
    $("#countdown").text(currentTimerValue);
}

//Timer
function Timer(currentTimer, mode){
    if(timer){
        reset(mode);
        return;
    }

    let countMin = parseInt(currentTimer.split(":")[0]);
    let countSec = parseInt(currentTimer.split(":")[1]);

    $("#start-stop-button").text("Stop");
    let phrase = mode == "work" ? "Work Time" : "Break-Time";
    let secs = (countMin*60) + countSec;
    timer = setInterval(()=>{
        let displayMins = Math.floor(secs/60);
        let displaySecs = secs%60;

        displayMins = displayMins < 10 ? `0${displayMins}` : displayMins;
        displaySecs = displaySecs < 10 ? `0${displaySecs}` : displaySecs;

        $("#countdown").text(`${displayMins}:${displaySecs}`);
        $("title").text(`${displayMins}:${displaySecs} - ${phrase}`);

        if(secs == -1){
            alarm.currentTime = 0;
            alarm.play();
            reset(mode);
            alert("Timer complete time to switch");
            return
        }
        secs--
    },1000);

}

$("#work-button").on("click", () => changeScene(workTimer, "work"));

$("#break-button").on("click", ()=> changeScene(breakTimer, "break"));

$("#start-stop-button").on("click", function(){
    alarm.play().then(()=>{
        alarm.pause();
    });
    if($(".selector").hasClass("work-selected")){
        if($(this).text() == "Start"){
            workTimer = $("#countdown").text();
        }
        Timer(workTimer, "work");
    }
    else{
        if($(this).text() == "Start"){
            breakTimer = $("#countdown").text();
        }
        Timer(breakTimer, "break");
    }
})

//New Task

function closeTaskInput(){
    document.body.style.overflow = "auto";
    animate(
        "#new-task-div",
        {
            opacity:0,
            duration:1000,
            ease: "out(3)",
            onComplete: self => $("#new-task-div").css("display","none")
        }
    )
}

function closeTaskDisplay(){
    document.body.style.overflow = "auto";
    animate(
        "#task-display-div",
        {
            opacity:0,
            duration:1000,
            ease: "in(3)",
            onComplete: self => $("#task-display-div").css("display","none")
        }
    )
}

$("#new-task").on("click", function(){
    //document.body.style.overflow = "hidden";
    $("#new-task-div").css("display","flex");
    $("#task-name").val("");
    $("#task-description").val("");
    animate(
        "#new-task-div",
        {
            opacity:1,
            duration:1000,
            ease: "in(3)"
        }
    )
})

$("#submit-button").on("click", function(){
    let title = $("#task-name").val();
    let description = $("#task-description").val();
    if(Object.getOwnPropertyNames(tasks).includes(title)){
        alert("Task name already exists, please enter a new title")
    }else{
        tasks[title] = description;
        let newDiv = $("<div>").addClass("next-task");
        let newHeading = $("<h2>").addClass("heading-font task-head");
        newHeading.text(title);
        newDiv.append(newHeading);
        $("#tasks").append(newDiv);
        closeTaskInput();
    }
})

$("#cancel-button").on("click", ()=>closeTaskInput())

//Open Task
$(document).on("click", ".next-task",function(){
    document.body.style.overflow = "hidden";
    let title = $(this).find(".task-head").text();
    currentSelectedTask = $(this);
    let description = tasks[title];
    $("#current-task-name").text(title);
    $("#curent-task-description").val(description);
    $("#task-display-div").css("display","flex");
    animate(
        "#task-display-div",
        {
            opacity:1,
            duration:1000,
            ease: "in(3)"
        }
    )
})

$("#complete-button").on("click", function(){
    currentSelectedTask.find(".task-head").css("opacity", 0.5);
    currentSelectedTask.removeClass("next-task");
    currentSelectedTask.addClass("next-task-complete")
    let newHR = $("<hr>");
    newHR.css({
        "z-index" : 1,
        "width" : "80%",
        "left" : "10%",
        "position" : "absolute"
    })
    currentSelectedTask.append(newHR);
    closeTaskDisplay()
})

$("#close-button").on("click", ()=> closeTaskDisplay())