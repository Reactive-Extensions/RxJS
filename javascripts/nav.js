 $(document).ready(function(){
   
   var $nav = $('header nav ul');

    $('section[role="main"] h1').each(function(index, el){
        var li = document.createElement('li');
        var a = document.createElement('a');
        var text = $(el).attr('data-nav') || el.innerText;

        el.id = el.innerText;
        a.innerText = '» ' + text;
        a.href = '#' + el.id;

        li.appendChild(a);

        $nav.append(li);

    });

 });