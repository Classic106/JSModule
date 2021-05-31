(()=>{
    let time_events = [
        {start: 0, duration: 15, title: 'Exercise'},
        {start: 25, duration: 30, title: 'Travel to work'},
        {start: 30, duration: 30, title: 'Plan day'},
        {start: 60, duration: 15, title: 'Review yesturday`s commits'},
        {start: 100, duration: 15, title: 'Code review'},
        {start: 180, duration: 90, title: 'Have lunch with John'},
        {start: 360, duration: 30, title: 'Skype call'},
        {start: 370, duration: 45, title: 'Follow up with designer'},
        {start: 405, duration: 30, title: 'Push up branch'},
];

document.addEventListener("DOMContentLoaded", function(){
    Init_calendar();
    RenderEvents();
    Beginning_events();
});

function RenderEvents(){

    document.querySelectorAll('.event').forEach((item)=>{item.remove()});

    for(let key = 0; key < time_events.length; key++){
        
        let tmp = [];
        let i = key;
        
        tmp.push(time_events[key]);
        let time = 0;
            
        for(i++; i < time_events.length; i++){

            let t = time_events[key].start + time_events[key].duration;
            
            if(t > time) time = t;

            if(time_events[i].start < time) {
                tmp.push(time_events[i]);
                key++;
            };
        }

        if(tmp.length > 2){

            let newarr = [];

            for(let key = 0; key < tmp.length; key++){
        
                let newtmp = [];
                let i = key;
                
                newtmp.push(tmp[key]);
                for(i++; i < tmp.length; i++){
        
                    let time = tmp[key].start + tmp[key].duration;
                    
                    if(tmp[i].start >= time){
                        newtmp.push(tmp[i]);
                        tmp.splice(i, 1);
                    };
                }
                newarr.push(newtmp);
            }

            newarr.reverse().forEach((item, index)=>{
                if(item.length > 1){
                    item.forEach((val)=>{
                        RenderEvent(val, index);
                    })
                }else{
                    RenderEvent(item[0], index);
                }
            });

        }else{
            tmp.forEach((item, index)=>{
                RenderEvent(item, index);
            });
        }
    }
}

function RenderEvent(item, index){

    const dom_time_events = document.querySelectorAll('.time_events');

    const div = document.createElement('div');

    Object.assign(div, {
        innerHTML: `<div></div>${(()=>(item.title.length > 28) ? item.title.slice(0, 26)+'...' : item.title)()}`,
        className: 'event',
        style: `margin-top: ${(item.start % 60) * 2}px;
            margin-left: ${200 * index}px;
            height: ${(item.duration < 10) ? 'max-content' : item.duration * 2}px;
            background: ${(item.body_color) ? item.body_color : ''};
            `,
        onmouseenter: function(){
            this.innerHTML = `<div></div>${item.title}`;
            if(item.title.length > 28) this.style.height = 'max-content';
        },
        onmouseleave: function(){
            this.innerHTML = `<div></div>${(item.title.length > 28) ? item.title.slice(0, 26)+'...' : item.title}`;
        },
        onclick: function(){
            if(!this.querySelector('.event_back')){
                
                const div = document.createElement('div');
                div.className = "event_back";
                div.innerHTML = `<button>Edit</button><button>Remove</button>`;
                const btn = div.querySelectorAll('button');
                    btn[0].onclick = function(){
                        const div = document.createElement('div');
                        
                        Object.assign(div,{
                            className: 'modal',
                            onclick: function(event){
                                if(event.target.className == 'modal') event.target.remove();
                            },
                        });
     
                        div.appendChild(Add_form([item, ...Event_time_to_string(item)]));
                        document.querySelector('body').appendChild(div);
                    }

                    btn[1].onclick = function(){
                    
                        time_events = time_events.filter((val)=> (item.title == val.title) ? false : true);
                        document.querySelectorAll('.event').forEach((item)=>{item.remove()});
                        RenderEvents();
                    }
                this.appendChild(div);
                
            }else this.querySelector('div').remove();
        }
    });
    
    div.querySelector('div').style = `background: ${(item.border_color) ? item.border_color : ''};`;

    dom_time_events[Math.floor(item.start / 60)].appendChild(div);
}

function Init_calendar(){
    
    const beginning_events = document.createElement('div');
        beginning_events.className = 'beginning_events';

    const calendar = document.createElement('div');
        calendar.className = 'calendar';
    
    for(let key = 8; key <= 17; key++){
        
        const div = document.createElement('div');
        
        div.className = 'time';

        div.innerHTML = `
            <div class="time_head">
                <span>${key}:00</span>
                <span>${key}:30</span>
            </div>
            <div class="time_events"></div>`;
        
        calendar.appendChild(div);
    }

    document.querySelector('body').append(Add_form(), calendar, beginning_events);
}

function Add_form(item){

    const obj = Object.assign({}, (item) ? item[0] : {});
    const event_val = ["08:00", '18:00', '', "#E2ECF5", "#6E9ECF"];

    const add_event = document.createElement('form');
        Object.assign(add_event, {
            className: 'add_event',
            innerHTML: `
                <div class="add_event_time">
                    <div><label>From</label><input type="time" min="08:00" max="17:00" value=${(item) ? item[1] : event_val[0]} name="from"></div>
                    <div><label>To</label><input type="time" min="08:00" max="18:00" value=${(item) ? item[2] : event_val[1]} name="to"></div>
                </div>
                <div class="add_event_title">
                    <label>Title</label>
                    <input type="text" placeholder="Enter title..." ${(item) ? `value="${item[0].title}"` : event_val[2]}>
                </div>
                <div class="add_event_colors">
                    <div>
                        <label for="body_color">Chose body color</label>
                        <input type="color" id="body_color" name="body_color" value=${event_val[3]}>
                    </div>
                    <div>
                        <label for="border_color">Chose border color</label>
                        <input type="color" id="border_color" name="border_color" value=${event_val[4]}>
                    </div>
                </div>
                <button>${(item) ? 'Change item' : 'Add event' }</button>
                `,
        });
    
        add_event.querySelector('button').onclick = function(event){
            event.preventDefault();
            if(!obj.title){
                alert('Fill title input!!!');
                return;
            }
    
            if(!obj.start) obj.start = 0;
            if(!obj.duration) obj.duration = (obj.start) ? 600 - obj.start : 600;

            if(item) {
                const index = time_events.findIndex((val)=>{
                    if (Object.is(item[0], val)) return true;
                    return false;
                });
                if(index) Object.assign(time_events[index], obj);
                else return;
            }else time_events.push(obj);

            time_events.sort((a, b)=>{
                return a.start - b.start;
            });
            
            const inputs = add_event.querySelectorAll('input');
            
            for(let key = 0; key < inputs.length; key++){
            
                inputs[key].value = event_val[key];
            }

            RenderEvents();
        }

    const inputs = add_event.querySelectorAll('input');
        
        inputs[0].onchange = function(){

            obj.start = Event_time_to_digit.call(this);
            inputs[1].min = this.value;
        };

        inputs[1].onchange = function(){
            
            const time = Event_time_to_digit.call(this);
            const duration = (obj.start) ? (time - obj.start) : time;

            if(duration <= 0) return;
            if(duration != 0) obj.duration = duration;
        };

        inputs[2].oninput = function(){
            obj.title = this.value;
        };
        
        inputs[3].onchange = function(){
            obj.body_color = this.value;
        };
        
        inputs[4].onchange = function(){
            obj.border_color = this.value;
        };

    return add_event;
}

function Beginning_events(){

    const beginning_events = document.querySelector('.beginning_events');
    const date = new Date(Date.now());
    //const date = new Date();
        //date.setHours(14);
        //date.setMinutes(20);
    
    let arr = [];

    time_events.forEach((item)=>{
        
        const item_time = Event_time_to_string(item);

        const time = +''+((date.getHours()*60)-(8*60))+date.getMinutes();

        if(!(item.start > time) && time < (item.start + item.duration)){
            
            const new_item = Object.assign({}, item);
                new_item.from = item_time[0];
                new_item.to = item_time[1];

            arr.push(new_item);
        }
    });

    if(arr.length){
        
        beginning_events.innerHTML = '';
        beginning_events.classList.add('active');

        arr.forEach((item)=>{

            const div_item = document.createElement('div');
                div_item.className = 'begin_event';

            const span_from = document.createElement('span');
                span_from.innerText = `Start: ${item.from}`;

            const span_to = document.createElement('span');
                span_to.innerText = `End: ${item.to}`;

            const span_message = document.createElement('span');
                span_message.innerText = `Message: ${item.title}`;

            div_item.append(span_from, span_to, span_message);
            beginning_events.append(div_item);
        });
    }else{
        beginning_events.classList.remove('active');
    }
    
    setInterval(()=>Beginning_events(), 60000);
}

function Event_time_to_digit(){

    const input_time = this.value.split(':');
    return(( +input_time[0] * 60) - (8 * 60)) + (+input_time[1] % 60);
}

function Event_time_to_string(item){

    const from = new Date();
        from.setHours(8 + (item.start / 60));
        from.setMinutes(item.start % 60);

    const to = new Date();
        to.setHours(8 + (item.start + item.duration) / 60);
        to.setMinutes((item.start + item.duration) % 60);
                        
    let new_from = [from.getHours(), from.getMinutes()];
    let new_to = [to.getHours(), to.getMinutes()];
                        
        if(new String(from.getHours()).length == 1) new_from[0] = '0'+ from.getHours();
        if(new String(from.getMinutes()).length == 1) new_from[1] = '0'+ from.getMinutes();
        if(new String(to.getHours()).length == 1) new_to[0] = '0'+ to.getHours();
        if(new String(to.getMinutes()).length == 1) new_to[1] = '0'+ to.getMinutes();
        
    return [new_from.join(":"),new_to.join(":")];
}
})();