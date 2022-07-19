'use strict';

// TODO: Render the cinema (7x15 with middle path)
// TODO: Support selecting a seat
// TODO: Only a single seat should be selected
// TODO: Support Unselecting a seat

// TODO: When seat is selected a popup is shown
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 

// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 

// TODO: in seat details, show available seats around 
// TODO: Price is kept only for 10 seconds 

var gElSelectedSeat = null;
var gTimeoutBooking = null;
var gCinema = createCinema();
renderCinema();

function createCinema() {
    var cinema = [];
    for (var i = 0; i < 5; i++) {
        cinema[i] = [];
        for (var j = 0; j < 15; j++) {
            var cell = {
                isSeat: j !== 7,
            }
            if (cell.isSeat) {
                cell.price = 4+i
                cell.isBooked = false
            }
            cinema[i][j] = cell
        }
    }
    return cinema;    
}

function renderCinema() {
    var strHTML = '';
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            var cell = gCinema[i][j];
            // for cell of type SEAT add seat class
            var className = (cell.isSeat)? 'seat' : ''
            className +=  (cell.isBooked)? ' booked' : ''
            
            // TODO: for cell that is booked add booked class
            // Add a seat title: `Seat: ${i}, ${j}`

            strHTML += `\t<td class="cell ${className}" title="${`Seat: ${i+1}, ${j+1}`}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elSeats = document.querySelector('.cinema-seats');
    elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) { 
    // TODO: ignore none seats and booked
    var cell = gCinema[i][j]
    if (!cell.isSeat || cell.isBooked) return
    console.log('cell', cell);
    elCell.classList.toggle('selected')
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    gElSelectedSeat = (elCell !== gElSelectedSeat)? elCell : null
    if (gElSelectedSeat) showSeatDetails({i:i, j:j})
    else hideSeatDetails()
}
function showSeatDetails(pos) {
    var elPopup = document.querySelector('.popup');
    var seat = gCinema[pos.i][pos.j];
    var seats = getAvailableSeats(pos)

    elPopup.querySelector('h2 span').innerText = `${pos.i+1}-${pos.j+1}`
    elPopup.querySelector('h3 span').innerText = seat.price
    elPopup.querySelector('p').innerText = JSON.stringify(seats)
    var elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    // TODO: update the <button> dataset
    elPopup.hidden = false;
    gTimeoutBooking = setTimeout(()=>{
        unSelectSeat();
    }, 4500)
}
function hideSeatDetails() { 
    document.querySelector('.popup').hidden = true    
}

function bookSeat(elBtn) { 
    console.log('Booking seat, button: ', elBtn);
    var i = +elBtn.dataset.i
    var j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    
    console.log(`Booked: ${i+1}-${j+1}`);
    
    // renderCinema()
    gElSelectedSeat.classList.add('booked')
    unSelectSeat()
    clearTimeout(gTimeoutBooking)
}

function unSelectSeat() {
    hideSeatDetails();
    gElSelectedSeat.classList.remove('selected')
    gElSelectedSeat = null
}


function getAvailableSeats(pos) {
    var seats = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gCinema[i].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (gCinema[i][j].isSeat && !gCinema[i][j].isBooked) seats.push({i:i, j:j})
        }
    }
    return seats;
}


