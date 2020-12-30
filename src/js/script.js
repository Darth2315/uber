window.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger'),
          menu = document.querySelector('.menu'),
          menuItem = document.querySelectorAll('.menu_item');

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('menu_active');
        hamburger.classList.toggle('hamburger_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.toggle('menu_active');
            hamburger.classList.toggle('hamburger_active');
        });
    });

    // Modal
    const btn = document.querySelectorAll('button'),
          close = document.querySelectorAll('.modal_close'),
          overlay = document.querySelector('.overlay'),
          modal = document.querySelector('#callback'),
          thanksModal = document.querySelector('#thanks');

    function closeModal(modal) {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    }
    function openModal(modal) {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }

    btn.forEach(item => {
        item.addEventListener('click', () => {
            openModal(modal);
        });
    });

    close.forEach(item => {
        item.addEventListener('click', () => {
            closeModal(modal);
        });
    });

    function closeModalByEscape() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
    closeModalByEscape();

    function closeModalByOverlay() {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
    closeModalByOverlay();

    // send form data
    const forms = document.querySelectorAll('.feed-form'),
          inputs = document.querySelectorAll('input');

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
        return await res.text();
    };

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
    };

    const message = {
        loading: 'img/spinner.svg',
        success: "Отправка прошла успешно!",
        error: "Что-то пошло не так..."
    };

    forms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const spinner = document.createElement('img');
            spinner.src = message.loading;
            spinner.classList.add('modal__spinner');
            item.appendChild(spinner);

            const formData = new FormData(item);

            postData('assets/server.php', formData)
            .then(res => {
                console.log(res);
                openModal(thanksModal);
            })
            .catch(() => thanksModal.textContent = message.error)
            .finally(() => {
                clearInputs();
                spinner.remove();
                modal.style.display = 'none';
                setTimeout(() => {
                    closeModal(thanksModal);
                }, 5000);
            });
        });
    });

    // phone mask
    const phoneInputs = document.querySelectorAll('[name="phone"]');
    let setCursorPosition = (pos, elem) => {
        elem.focus();

        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            let range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    function createMask(event) {
        let matrix = '+38 (0__) ___ __ __',
            i = 0,
            def = matrix.replace(/\D/g, ''),
            val = this.value.replace(/\D/g, '');

        if (def.length > val.length) {
            val = def;
        }

        this.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        });

        if (event.type === 'blur') {
            if (this.value.length == 2) {
                this.value = '';
            }
        } else {
            setCursorPosition(this.value.length, this);
        }
    }

    phoneInputs.forEach(item => {
        item.addEventListener('input', createMask);
        item.addEventListener('blur', createMask);
        item.addEventListener('focus', createMask);
    });        
});