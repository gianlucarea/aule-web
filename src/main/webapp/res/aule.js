// da sistemare, chiamate ajax non funzionano

$(document).ready(function() {

    var authToken = sessionStorage.getItem('authToken'); // Recupera il token salvato
    
    function hideClassroomButtons() {
      $('#aule .btn').hide();
    }
    function showClassroomButtons() {
      $('#aule .btn').show();
    }

    function hideEventButtons() {
      $('#eventi .btn').hide();
    }
    function showEventButtons() {
      $('#eventi .btn').show();
    }

    // Al click sulla navbar "Eventi"
    $('#nav-eventi').click(function() {
      hideClassroomButtons();
      showEventButtons();
    });
    // Al click sulla navbar "Aule"
    $('#nav-aule').click(function() {
      hideEventButtons();
      showClassroomButtons();
    });
    
    function removeNotAuthorizedButton(){
       console.log(authToken);
      if(authToken === "undefined"){
        $('#aule .btn-auth').hide();
        $('#loginButton').hide();
       } else {
        $('#aule .btn-auth').show();
        $('#loginButton').hide();
      }
    }



// id addAula on submit function 
$('#addAulaForm').submit(function(event) {
       event.preventDefault(); 
      // object building 
      var formData = {
        name: $('#name').val(),
        positionID: $('#positionID').val(),
        capacity: $('#capacity').val(),
        email: $('#email').val(),
        numberOfEthernet: $('#numberOfEthernet').val(),
        numberOfSockets: $('#numberOfSockets').val(),
        note: $('#note').val(),
        equipmentsId: $('#equipmentsId').val()
      };
      console.log(formData);
      
    
      $.ajax({
        url: 'rest/classroom/addClassroom',
        type: 'POST',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer ' + authToken 
        },
        data: JSON.stringify(formData),
        created: function() {
            message("Aula inserita", "success");
        },
        error: function() {
          console.log(JSON.stringify(formData));
          alert('Errore inserimento aula.');
        } 
      });
});

  function populateClassroomNames() {
      $.ajax({
        url: 'rest/classroom/all', 
        type: 'GET', 
        success: function(response) {
          var classroomNames = Object.keys(response); //array di nomi delle aule

          // choice box con nomi delle aule
          var classroomSelect = $('#classroomName');
          classroomNames.forEach(function(className) {
            classroomSelect.append('<option value="' + response[className] + '">' + className + '</option>');
          });
        },
        error: function() {
          console.log('Errore durante il recupero dei nomi delle aule');
        }
      });
    }
  
    function populateGroupNames() {
      $.ajax({
        url: 'rest/classroom/group/all', 
        type: 'GET',
        success: function(response) {
          var groupNames = Object.keys(response); // array nomi dei gruppi
          var groupSelect = $('#groupName');
          groupNames.forEach(function(groupName) {
            groupSelect.append('<option value="' + response[groupName] + '">' + groupName + '</option>');
          });
        },
        error: function() {
          console.log('Errore durante il recupero dei nomi dei gruppi');
        }
      });
    }
    
    function populateTable() {
        $.ajax({
            url: 'rest/classroom/display/all', 
            type: 'GET',

            success: function(response) {
              //rimozione righe statiche
              $('#table-body').empty();
              console.log(response);
              
              Object.keys(response).forEach(key =>{
                  
                var row = '<tr>' +
                  '<td><a href="invoice.html" class="text-reset" tabindex="-1">' + key + '</a></td>' +
                  '<td>' + response[key]["email"] + '</td>' +
                  '<td>' + response[key]["capacity"] + '</td>' +
                  '<td>' + response[key]["note"] + '</td>' +
                  '<td class="text-end"></td>' +
                  '</tr>';
                $('#table-body').append(row);
              });
            
            },
            error: function() {
              console.log('Errore durante il recupero dei dati dal database');
            }
        });
    }
  
    removeNotAuthorizedButton();
    //choicebox dei nomi delle aule e dei gruppi
    populateClassroomNames();
    populateGroupNames();
    populateTable();
  });
  
  // 
  $('#addClassroomToGroupForm').submit(function(event) {
    event.preventDefault();
    var classroomId = $('#classroomName').val();
    var groupId = $('#groupName').val();
    
    console.log(classroomId);
    console.log(groupId);
    var formData = {
      classroom_id: classroomId,
      group_id: groupId
    };
    
    $.ajax({
      url: 'rest/classroom/'+ classroomId+ '/group/'+ groupId, 
      type: 'POST', 
      contentType: 'application/json',
      
      success: function(response) {
        console.log('Aula aggiunta al gruppo con successo');
      },
      error: function() {
        console.log('Errore durante l\'aggiunta dell\'aula al gruppo');
      }
    });

    // Righe dinamiche per la tabella (WIP)

  });
