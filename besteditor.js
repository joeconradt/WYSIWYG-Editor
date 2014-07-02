function Editor() {
    this.t = null;
    this.options = null;
    
    this.commands = {
        bold: { type: 'button', command: 'bold', icon: 'bold' },
        italic: { type: 'button', command: 'italic', icon: 'italic' },
        justifyCenter: { type: 'button', command: 'justifyCenter', icon: 'align-center' }, 
        justifyLeft: { type: 'button', command: 'justifyLeft', icon: 'align-left' },
        justifyRight: { type: 'button', command: 'justifyRight', icon: 'align-right' },
        justifyFull: { type: 'button', command: 'justifyFull', icon: 'align-justify' },
        paragraph: { type: 'button', command: 'insertParagraph' },
        heading1: { type: 'button', command: 'formatBlock', value: '<h1>' },
        heading2: { type: 'button', command: 'formatBlock', value: '<h2>' },
        heading3: { type: 'button', command: 'formatBlock', value: '<h3>' },
    };  
    
    this.toolBar = [
        'bold',
        'italic',
        {
            icon: 'align-right', 
            commands: [ 'justifyCenter', 'justifyLeft', 'justifyRight','justifyFull', ]
        },
        {
            icon: 'paragraph',
            values: { 
                'paragraph': 'paragraph', 
                '<span style="font-size:22px;font-weight:bold">header 1</span>': 'heading1',
                '<span style="font-size:18px;font-weight:bold">header 2</span>': 'heading2',
                '<span style="font-size:14px;font-weight:bold">header 3</span>': 'heading3',
            }
        }
    ];
            
    return this;
}
        
Editor.prototype.setDefaultOptions = function(options) {
    if(options == undefined) options = {};
    if(options.inline == undefined) options.inline = false;
    if(options.theme == undefined) options.theme = 'none';
    return options;
}
    
Editor.prototype.init = function(elementId, options) {
    this.t = document.getElementById(elementId);
    this.options = this.setDefaultOptions(options);
        
    var self = this;
    var dIndex = 0;
    var toolBar = document.createElement('div');
        
    toolBar.className = 'editor-toolbar';
        
    if(this.options.inline) {
        var icon = document.createElement('i');
        icon.className = 'fa fa-caret-down';
        toolBar.appendChild(icon);
        this.t.setAttribute('contenteditable', 'true');
        this.t.className += ' editor-inline';
        toolBar.className += ' best-editor-inline-toolbar';
        toolBar.className += ' editor-theme-' + this.options.theme;
        this.t.parentNode.appendChild(toolBar);
    } else {
        var editarea = document.createElement('div');
        var footer = document.createElement('div');
        
        this.t.appendChild(toolBar);
        editarea.className = 'editor-editarea';
        editarea.setAttribute('contenteditable', 'true');
        footer.className = 'editor-footer';
        this.t.appendChild(editarea);
        this.t.appendChild(footer);
    }
        
    this.t.className += ' best-editor';
    this.t.className += ' editor-theme-' + this.options.theme;
    
    for(var p in this.toolBar) {
        var item = this.toolBar[p];
        if(typeof item === 'object') {

            var list = document.createElement('ul'), dropdown = document.createElement('button'), icon = document.createElement('i'), icon2 = document.createElement('i');
            list.className = 'editor-dropdown';
            icon.className = 'fa fa-' + item.icon;
            icon2.className = 'fa fa-caret-down';
            dropdown.appendChild(icon);
            dropdown.appendChild(icon2);
            dropdown.appendChild(list);
            dropdown.setAttribute('data-target', 'dropdown-' + (++dIndex));
            dropdown.className = 'dropdown-button';
            list.setAttribute('id', 'dropdown-' + dIndex);
            toolBar.appendChild(dropdown);
            dropdown.onclick = function(e) { self.dropdownClick(e, this); };

            if(item.commands != undefined && item.values == undefined) {
                for(var i2 = 0; i2 < item.commands.length; i2++) {
                    var button = document.createElement('button'), icon = document.createElement('i'), listItem = document.createElement('li');;
                    button.setAttribute('data-command', item.commands[i2]);
                    icon.className = 'fa fa-' + this.commands[item.commands[i2]].icon;
                    list.appendChild(listItem);
                    listItem.appendChild(button);
                    button.appendChild(icon);
                    button.onclick = function(e) { self.buttonClick(e, this); };  
                }
            }
            for(var p2 in item.values) {
                var button = document.createElement('button'), listItem = document.createElement('li');;
                button.setAttribute('data-command', item.values[p2]);
                button.innerHTML = p2;
                list.appendChild(listItem);
                listItem.appendChild(button);
                button.onclick = function(e) { self.buttonClick(e, this); };    
            }

        } else {
            var button = document.createElement('button');
            var icon = document.createElement('i');
            button.setAttribute('data-command', item);
            icon.className = 'fa fa-' + this.commands[item].icon;
            toolBar.appendChild(button);
            button.appendChild(icon);
            button.onclick = function(e) { self.buttonClick(e, this); };
        }
    }
    document.body.onclick = function(e) { 
        self.hideDropdowns();
    }
    if(this.options.inline) {
        this.t.onclick = function(e) { 
            toolBar.className += ' active';
            toolBar.style.left = (e.pageX - toolBar.offsetWidth / 2) + "px";
            toolBar.style.top = (e.pageY - 55) + "px";   
        };   
    }
}
    
Editor.prototype.buttonClick = function(e, element) {
    e.stopPropagation();
    var command = element.getAttribute('data-command');
    this.execute(this.commands[command]);
    this.hideDropdowns();
}
    
Editor.prototype.dropdownClick = function(e, element) {
    console.log("dropdownClick");
    e.stopPropagation();
    this.hideDropdowns();
    element.className += ' active';
}
            
Editor.prototype.hideDropdowns = function() {
    console.log("hide all");
    var dropdowns = document.getElementsByClassName('dropdown-button');
    for(var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].className = 'dropdown-button'; 
    }
}
    
Editor.prototype.execute = function(command) {
    console.log("Executing: " + command.command + ' ' + command.value);
    document.execCommand(command.command,null,command.value);
}
