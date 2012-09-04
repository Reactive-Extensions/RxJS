 $(document).ready(function(){
   
   var $nav = $('header nav ul');

    $('section[role="main"] h1').each(function(index, el){
        var li = document.createElement('li');
        var a = document.createElement('a');

        el.id = el.innerText;
        a.innerText = '» ' + el.innerText;
        a.href = '#' + el.id;

        li.appendChild(a);

        $nav.append(li);

    });

 });