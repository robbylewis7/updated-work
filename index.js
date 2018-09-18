'use strict';

//---------------------------------------------
//show + hide submit form
//---------------------------------------------

$('#log-create-form').hide();



$('.searchForDate').on('click', '#createNew', function(){
    $('#log-create-form').show();
    $('.searchForDate').hide();
    $('#logSearch').hide(); 

    
});

$('#log-create-form').on('click', '.js-logCancelButton', function(){
    $('.searchForDate').show();
    $('#log-create-form').hide();
    
});


//function getTemplate(data){
//    return `<span id = "logDate"><p>${data.date.substring(0,10)}</p></span>
//                <p id = "sleepTotal">Sleep Total: ${data.sleepTotal}</p>
//                <p id = "waterIntake">Water Intake: ${data.waterIntake}</p> 
//                <p id = "cleanEating">Clean Eating: ${data.cleanEating}</p>
//                <p id = "stress">Stress: ${data.stress}</p>
//                <p id = "energy">Energy: ${data.energy}</p>
//                <p id = "exercise">Exercise: ${data.exercise}</p>
//                <p id = "community">Strength of Community: ${data.communityFeeling}</p>
//                <input type = "hidden" id = "id" value = ${data.id}>`
//}


//---------------------------------------------
//Default to today for new logs
//---------------------------------------------

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = yyyy + '-' + mm + '-' + dd;

$('#entry-date').val(today);



//---------------------------------------------
// get logs
//---------------------------------------------

function displayResults() {
    $.getJSON('/logs', function(data) {
        console.log(data);


       let logArray = data.logs.map(function(data){
           return `<div class = "eachLog">
               <span id = "logDate"><p>${new Date(data.date).getMonth()+1}/${new Date(data.date).getDate()+1}/${new Date(data.date).getFullYear()}</p></span>
                <p id = "sleepTotal">Sleep Total: ${data.sleepTotal}</p>
                <p id = "waterIntake">Water Intake: ${data.waterIntake}</p> 
                <p id = "cleanEating">Clean Eating: ${data.cleanEating}</p>
                <p id = "stress">Stress: ${data.stress}</p>
                <p id = "energy">Energy: ${data.energy}</p>
                <p id = "exercise">Exercise: ${data.exercise}</p>
                <p id = "community">Strength of Community: ${data.communityFeeling}</p>
                </div>
                `
            
//            console.log(data.waterIntake);
        })
       $('#allLogUl').html(logArray);
    });
}


function displayDayLog(){
    $('#js-search-form').submit(function(e){
        e.preventDefault();
        $('#instructions').hide();
        let date = $('#search-date').val();
        $.getJSON('/logs', function(data) {

       let logArray = data.logs.filter(function(data){
           return data.date.substring(0,10) === date;
       })
       console.log(logArray);
        let today = `
        <div id = "logSearch">
               <span id = "logDate"><p>${new Date(logArray[0].date).getMonth()+1}/${new Date(logArray[0].date).getDate()+1}/${new Date(logArray[0].date).getFullYear()}</p></span>
                <p id = "sleepTotal">Sleep Total: ${logArray[0].sleepTotal}</p>
                <p id = "waterIntake">Water Intake: ${logArray[0].waterIntake}</p> 
                <p id = "cleanEating">Clean Eating: ${logArray[0].cleanEating}</p>
                <p id = "stress">Stress: ${logArray[0].stress}</p>
                <p id = "gratitude">Gratitude: ${logArray[0].gratitude}</p>
                <p id = "energy">Energy: ${logArray[0].energy}</p>
                <p id = "exercise">Exercise: ${logArray[0].exercise}</p>
                <p id = "community">Strength of Community: ${logArray[0].communityFeeling}</p>
                <input type = "hidden" id = "id" value = ${logArray[0].id}>
                <button type= "button" class = "logSearchButtons" id = "editButton">Edit</button>
                <button type = "button" class = "logSearchButtons">Cancel</button>
        </div>
`
       $('#todaysLog').html(today);
    })
    
    
});
}



//---------------------------------------------
// save new log button
//---------------------------------------------





        $('#log-create-form').on('submit', function(e) {
            e.preventDefault();

            let logData = {
                date: $('#entry-date').val(),
                sleepStartHr: $('#sleepstart-hr option:selected').val(),
                sleepStartMin: $('#sleepstart-min option:selected').val(),
                sleepEndHr: $('#sleepend-hr option:selected').val(),
                sleepEndMin: $('#sleepend-min option:selected').val(),
                stress: $('#stress option:selected').val(),
                gratitude: $('#gratitude option:selected').val(),
                energy: $('#energy option:selected').val(),
                communityFeeling: $('#communityFeeling option:selected').val(),
                waterIntake: $('#waterIntake option:selected').val(),
                cleanEating: $('#cleanEating option:selected').val(),
                exercise: $('#exercise option:selected').val(),

            };
            console.log(logData)
            postNewLog(logData);
            });


            function postNewLog(logData) {
            let settings = {
                url: '/logs',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(logData),
                success: function(){
                    alert('Item has been saved!');
                }
            };

            $.ajax(settings)
                .fail((xhr, status, error) => {
                $('.error-message')
                    .empty()
                    .append(`Error: ${error}`);
                });
            }



//---------------------------------------------
// edit log button
//---------------------------------------------


$('#todaysLog').on('click', '#editButton', function(){
        let date = $('#search-date').val();
        console.log(date);
        $.getJSON('/logs', function(data) {
        let logArray = data.logs.filter(function(data){
        return data.date.substring(0,10) === date;
       });
            console.log(logArray);
        let today = `
       <div id = "createLog">
        <form id="log-edit-form">
            <fieldset>
				    <div class="form-elements">
                        
                    <div class="form-elements" id = "entry-date-div">
				        <label for="entry-date"> Today is:   </label><input type="date" value = ${date} id="entry-date" min="2018-01-01" required><br>
                    </div>
                        
                    <div class="form-elements">
                                <label for="sleepstart-hr">Last night, I fell asleep at </span></label>
								<select id="sleepstart-hr" class="select" name="sleepstart-hr"><br>
												<option value="xx" id="sleepstart-hrxx"></option>
												<option value="00" id="sleepstart-hr00">12AM</option>
												<option value="1" id="sleepstart-hr01">1AM</option>
												<option value="2" id="sleepstart-hr02">2AM</option>
												<option value="3" id="sleepstart-hr03">3AM</option>
												<option value="4" id="sleepstart-hr04">4AM</option>
												<option value="5" id="sleepstart-hr05">5AM</option>
												<option value="6" id="sleepstart-hr06">6AM</option>
												<option value="7" id="sleepstart-hr07">7AM</option>
												<option value="8" id="sleepstart-hr08">8AM</option>
												<option value="9" id="sleepstart-hr09">9AM</option>
												<option value="10" id="sleepstart-hr10">10AM</option>
												<option value="11" id="sleepstart-hr11">11AM</option>
												<option value="12" id="sleepstart-hr12">12PM</option>
												<option value="13" id="sleepstart-hr13">1PM</option>
												<option value="14" id="sleepstart-hr14">2PM</option>
												<option value="15" id="sleepstart-hr15">3PM</option>
												<option value="16" id="sleepstart-hr16">4PM</option>
												<option value="17" id="sleepstart-hr17">5PM</option>
												<option value="18" id="sleepstart-hr18">6PM</option>
												<option value="19" id="sleepstart-hr19">7PM</option>
												<option value="20" id="sleepstart-hr20">8PM</option>
												<option value="21" id="sleepstart-hr21">9PM</option>
												<option value="22" id="sleepstart-hr22">10PM</option>
												<option value="23" id="sleepstart-hr23">11PM</option>
											</select>
                                      
                        
                                   
											<label for="sleepstart-min" class="colon">:</label>
											<select id="sleepstart-min" class="select" name="sleepstart-min"><br>
												<option value="xx" id="sleepstart-hrxx"></option>
												<option value="00" id="sleepstart-min00">00</option>
												<option value="15" id="sleepstart-min15">15</option>
												<option value="30" id="sleepstart-min30">30</option>
												<option value="45" id="sleepstart-min45">45</option>
											</select>
										<br>
                                        </div>
                        
                                        <div class="form-elements">
										<label for="sleepend-hr">Today, I woke up at </label>
											<select id="sleepend-hr" class="select" name="sleepsend-hr"><br>
												<option value="xx" id="sleepend-hrxx"></option>
												<option value="00" id="sleepend-hr00">12AM</option>
												<option value="1" id="sleepend-hr01">1AM</option>
												<option value="2" id="sleepend-hr02">2AM</option>
												<option value="3" id="sleepend-hr03">3AM</option>
												<option value="4" id="sleepend-hr04">4AM</option>
												<option value="5" id="sleepend-hr05">5AM</option>
												<option value="6" id="sleepend-hr06">6AM</option>
												<option value="7" id="sleepend-hr07">7AM</option>
												<option value="8" id="sleepend-hr08">8AM</option>
												<option value="9" id="sleepend-hr09">9AM</option>
												<option value="10" id="sleepend-hr10">10AM</option>
												<option value="11" id="sleepend-hr11">11AM</option>
												<option value="12" id="sleepend-hr12">12PM</option>
												<option value="13" id="sleepend-hr13">1PM</option>
												<option value="14" id="sleepend-hr14">2PM</option>
												<option value="15" id="sleepend-hr15">3PM</option>
												<option value="16" id="sleepend-hr16">4PM</option>
												<option value="17" id="sleepend-hr17">5PM</option>
												<option value="18" id="sleepend-hr18">6PM</option>
												<option value="19" id="sleepend-hr19">7PM</option>
												<option value="20" id="sleepend-hr20">8PM</option>
												<option value="21" id="sleepend-hr21">9PM</option>
												<option value="22" id="sleepend-hr22">10PM</option>
												<option value="23" id="sleepend-hr23">11PM</option>
											</select>
											<label for="sleepend-min" class="colon">:</label>
											<select id="sleepend-min" class="select" name="sleepend-min"><br>
												<option value="xx" id="sleepend-minxx"></option>
												<option value="00" id="sleepend-min00">00</option>
												<option value="15" id="sleepend-min15">15</option>
												<option value="30" id="sleepend-min30">30</option>
												<option value="45" id="sleepend-min45">45</option>
											</select>
										</div>
                        
                                        <div class="form-elements">
                                        <label for="stress">Stress</label>
								            <select id="editStress" name="stress" class="select"  ><br>
                                                <option value="--" id="stress--"></option>
												<option value="01" id="stress01">01</option>
												<option value="02" id="stress02">02</option>
												<option value="03" id="stress03">03</option>
												<option value="04" id="stress04">04</option>
												<option value="05" id="stress05">05</option>
                                            </select><br>
                                            </div>
                                            <div class="form-elements">
                                            <label for="gratitude">Gratitude</label>
								            <select id="gratitude" name="gratitude" class="select"><br>
                                                <option value="--" id="gratitude--"></option>
												<option value="01" id="gratitude01">01</option>
												<option value="02" id="gratitude02">02</option>
												<option value="03" id="gratitude03">03</option>
												<option value="04" id="gratitude04">04</option>
												<option value="05" id="gratitude05">05</option>
                                            </select><br>
                                            </div>
                
                                            <div class="form-elements">
                                            <label for="energy">Energy</label>
								            <select id="energy" name="energy" class="select"><br>
                                                <option value="--" id="energy--"></option>
												<option value="01" id="energy01">01</option>
												<option value="02" id="energy02">02</option>
												<option value="03" id="energy03">03</option>
												<option value="04" id="energy04">04</option>
												<option value="05" id="energy05">05</option>
                                            </select><br>
                                            </div>
                
                                            <div class="form-elements">
                                            <label for="communityFeeling">Community Strength</label>
								            <select id="communityFeeling" name="communityFeeling" class="select"><br>
                                                <option value="--" id="communityFeeling--"></option>
												<option value="01" id="communityFeeling01">01</option>
												<option value="02" id="communityFeeling02">02</option>
												<option value="03" id="communityFeeling03">03</option>
												<option value="04" id="communityFeeling04">04</option>
												<option value="05" id="communityFeeling05">05</option>
                                            </select><br>
                                            </div>
                
                                            <div class="form-elements">
                                            <label for="waterIntake">Today I drank at least</label>
								            <select id="waterIntake" name="waterIntake" class="select"><br>
                                                <option value="--" id="waterIntake--"></option>
												<option value="16" id="waterIntake01">16</option>
												<option value="32" id="waterIntake02">32</option>
												<option value="48" id="waterIntake03">48</option>
												<option value="64" id="waterIntake04">64</option>
												<option value="80" id="waterIntake05">80</option>
                                            </select><label>ounces of water</label>
                                            </div>
                        
                                        <div class="form-elements">

                                            <label for="cleanEating">Clean Eating</label>
								            <select id="cleanEating" name="cleanEating" class="select"><br>
                                                <option value="--" id="cleanEating--"></option>
												<option value="01" id="cleanEating01">01</option>
												<option value="02" id="cleanEating02">02</option>
												<option value="03" id="cleanEating03">03</option>
												<option value="04" id="cleanEating04">04</option>
												<option value="05" id="cleanEating05">05</option>
                                            </select><br></div>
                        
                                        <div class="form-elements">

                                            <label for="exercise">Exercise</label>
								            <select id="exercise" name="exercise" class="select"><br>
                                                <option value="--" id="exercise--"></option>
												<option value="01" id="exercise01">01</option>
												<option value="02" id="exercise02">02</option>
												<option value="03" id="exercise03">03</option>
												<option value="04" id="exercise04">04</option>
												<option value="05" id="exercise05">05</option>
                                            </select><br></div>


										<div class="form-buttons-div">
											<input type="submit" name="update-button" value="Update" class="editButtons js-logUpdateButton">
                                            <button type="button" name="delete-button" id ="deleteButton" class="editButtons js-logDeleteButton">Delete</button>
											<button type="button" name="cancel-button" id="cancelButton" class="editButtons js-logCancelButton">Cancel</button>

										</div>

							</fieldset>
						</form>
            </div>`
     $('#todaysLog').hide();
      $('#editLog').html(today);
        $('#editStress').val(`0${logArray[0].stress}`);
        $('#cleanEating').val(`0${logArray[0].cleanEating}`);
        $('#communityFeeling').val(`0${logArray[0].communityFeeling}`);
        $('#energy').val(`0${logArray[0].energy}`);
        $('#exercise').val(`0${logArray[0].exercise}`);
        $('#waterIntake').val(logArray[0].waterIntake);
        $('#sleepstart-hr').val(logArray[0].sleepStartHr); 
        $('#sleepstart-min').val(logArray[0].sleepStartMin); 
        $('#sleepend-hr').val(logArray[0].sleepEndHr); 
        $('#sleepend-min').val(logArray[0].sleepEndMin); 


    });
});


   $('#editLog').on('submit','#log-edit-form', function(e) {
            e.preventDefault();
            let logEditData = {
                date: $('#entry-date').val(),
                sleepStartHr: $('#sleepstart-hr option:selected').val(),
                sleepStartMin: $('#sleepstart-min option:selected').val(),
                sleepEndHr: $('#sleepend-hr option:selected').val(),
                sleepEndMin: $('#sleepend-min option:selected').val(),
                stress: $('#stress option:selected').val(),
                gratitude: $('#gratitude option:selected').val(),
                energy: $('#energy option:selected').val(),
                communityFeeling: $('#communityFeeling option:selected').val(),
                waterIntake: $('#waterIntake option:selected').val(),
                cleanEating: $('#cleanEating option:selected').val(),
                exercise: $('#exercise option:selected').val(),

            };
            console.log(logArray[0].id)
            putEditedLog(logEditData);
            });


            function putEditedLog(logEditData) {
            let settings = {
                url: '/logs/id',
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(logEditData),
                }


            $.ajax(settings)
                .fail((xhr, status, error) => {
                $('.error-message')
                    .empty()
                    .append(`Error: ${error}`);
                });
            };

//---------------------------------------------
// delete log 
//---------------------------------------------

   $('#editLog').on('submit','#deleteButton', function(e) {   
       console.log('click');
    
});
//
//function deleteLog(id) {
//  let settings = {
//    url: `/logs/${id}`,
//    method: 'DELETE'
//  };
//
//  $.ajax(settings)
//    .fail((xhr, status, error) => {
//      $('.error-message')
//        .empty()
//        .append(`Error: ${error}`);
//    });
//}
        

        displayResults();
        displayDayLog();
    
