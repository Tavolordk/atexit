document.getElementById('themeToggle').addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');

    const icon = this.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    }
    else {
        navbar.classList.remove("scrolled");
    }
});