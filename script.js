document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const header = document.querySelector('.app-header');
    
    // Smooth scrolling when clicking on tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetSelector = tab.getAttribute('data-target');
            if (targetSelector) {
                const targetEl = document.querySelector(targetSelector);
                if (targetEl) {
                    const headerHeight = header.offsetHeight;
                    // Calcula a posição do elemento subtraindo a altura do header fixo
                    const offset = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll spy: update active tab based on scroll position
    const sections = ['#visao-geral', '#avaliacoes', '#descricao'].map(id => document.querySelector(id)).filter(Boolean);
    
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = header.offsetHeight;
        
        // Verifica qual seção está sendo visualizada
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 10;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        // Atualiza a aba ativa
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (current) {
                if (tab.getAttribute('data-target') === `#${current}`) {
                    tab.classList.add('active');
                }
            } else {
                // Default to first tab at the very top
                if (tab === tabs[0]) {
                    tab.classList.add('active');
                }
            }
        });
    });
});
