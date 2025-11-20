document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('demo-popup');
    const closeButton = document.getElementById('close-popup');
    const hasSeenPopup = localStorage.getItem('hasSeenDemoPopup');

    // 1. Lógica do Pop-up de Demonstração
    if (!hasSeenPopup) {
        // Exibe o pop-up se o usuário nunca o viu
        setTimeout(() => {
            popup.classList.add('active');
        }, 1000); // Pequeno atraso para garantir que a página carregue
    }

    // Função para fechar o pop-up
    function closePopup() {
        popup.classList.remove('active');
        localStorage.setItem('hasSeenDemoPopup', 'true'); // Marca que o usuário viu
    }

    // Fecha ao clicar no botão
    closeButton.addEventListener('click', closePopup);

    // Fecha ao clicar fora do pop-up (no overlay)
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            closePopup();
        }
    });

    // 2. Lógica de Scroll Suave para a Navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Rola suavemente para a seção, ajustando para o cabeçalho fixo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
