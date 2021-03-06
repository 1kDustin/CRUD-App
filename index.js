class House {
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }

    addRoom(name, area) {
        this.rooms.push(new Room(name, area));
    }
}

class Room {
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }
}

class HouseService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

    static getAllHouses() {
        return $.get(this.url);
    }

    static getHouse(id) {
        return $.get(this.url + `/$(id)`);
    }

    static createHouse(house) {
        return $.post(this.url, house);
    }

    static updateHouse(house) {
        return $.ajax({
            url: this.url + `/${house._id}`, // pulling from URL above and adding the requested house id to the end of the string
            dataType: 'json', // it is going to be sent in json format
            data: JSON.stringify(house), //turning info into a string that can be sent across the web
            contentType: 'application/json',
            type: 'PUT' //put is used to send an update to existing information.
        });
    }

    static deleteHouse(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static houses;

    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses));
    }

    static render(houses) {
        this.houses = houses;
        $('#app').empty();
        for (let house of houses) {
            $('#app').prepend(
            `<div id="${house._id}" class="card">
                <div class="card-header">
                    <h2>${house.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
                </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                <input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${house._id}-room-name" class="form-control" placeholder="Room Area">
                                </div>
                            </div>
                            <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div>
            </div><br>`
            );
            for (let room of house.rooms) {
               $(`#${house._id}`).find('.card-body').append(
                   `<p>
                   <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                   <span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
                   <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`
               ) 
            }
        }
    }

}

DOMManager.getAllHouses();