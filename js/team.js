// Navigation highlighting based on scroll position
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.team-section');
    const navLinks = document.querySelectorAll('.team-list a');
    const offset = 88; // navbar 总占用高度

    // Function to update active navigation link
    function updateActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY + offset >= sectionTop - window.innerHeight * 0.3) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Initial check
    updateActiveLink();

    // Scroll event listener
    window.addEventListener('scroll', updateActiveLink);

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 88, // 推荐使用 px 值更精确
                behavior: 'smooth'
            });
        });
    });
});
