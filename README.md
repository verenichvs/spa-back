Установите этот репозиторий и откройте в VSCode. Создайте файл .env в корневой директории и заполните его как на картинке. Если есть возможность, создайте бд локально и заполните поля своими данными.

![image](https://github.com/verenichvs/spa-back/assets/115184978/79a717f7-95b3-4dd4-8af6-6f608fd95c74)


Запустите проект командой yarn start. Чтобы проверять приложение вместе с frontend частью - установите репозиторий https://github.com/verenichvs/spa-front откройте и после выполнения предыдущих действий следуйте указаниям из README файла spa-front репозитория. Чтобы проверить приложение только с backend частью - откройте или установите Postman (https://www.postman.com/). 
Вам будут доступны ендпоинты:
-регистрация - заполните поля как на картинке.

![image](https://github.com/verenichvs/spa-back/assets/115184978/714718a0-fc51-4740-af92-1ef134ca483c)

 В случае если не соблюдаются требования - вам вернётся сообщение с соответствующей ошибкой: 
    -User Name (цифры и буквы латинского алфавита) – обязательное поле;
    -E-mail (формат email) – обязательное поле;
    -password (цифры и буквы латинского алфавита, минимальное количество символов 7) – обязательное поле.

-авторизация -  после регистрации запомните email и password и заполните поля как на картинке. ![image](https://github.com/verenichvs/spa-back/assets/115184978/5ae61898-96d9-4d07-8b8c-d9ac8872871a)

Если пользователя с таким имейлом не существует или пароль не от этого аккаунта - вам вернётся сообщение с соответствующей ошибкой. Если требования соблюдены - вам вернётся сообщение с токеном который нам понадобится при добавлении коментария.

![image](https://github.com/verenichvs/spa-back/assets/115184978/9e61a52d-3e4d-4d5a-8955-605934cdf883)

- добавление коментария - воспользуйтесь токеном из предыдущего ответа и заполните поле как на картинке ниже. В случае если вы введёте несуществующий токен или не заполните поле - вы не сможете отправить коментарий, так как должны быть авторизированы для этого действия.

![image](https://github.com/verenichvs/spa-back/assets/115184978/3065611f-1326-456f-8668-d40102ad8db2)

заполните поля как на картинке: 

![image](https://github.com/verenichvs/spa-back/assets/115184978/d8c63db2-51c5-498c-88da-4bd82ee7415c)

    поле text - обязательное. в нём вы можете использовать такие html теги которые обязательно должны быть закрыты:
    
    ![image](https://github.com/verenichvs/spa-back/assets/115184978/305bc495-3c7e-411b-978b-0e80c17e7db6)
    
      если условия не соблюдаются - вернётся ошибка.
    поле file - не обязательно. Можно выбрать картинку или текстовый документ таких форматов: JPG, GIF, PNG, TXT. файл txt не должен превышать 100 кб(вернётся ошибка) а изображение должно быть не более 320х240 пикселей иначе       его автоматически обрежет до заданых значений.
    поле parrentCommentId - необязательное поле. Отвечает за то, хотите вы отставить сообщение на странице или коментировать другое сообщение.
-сортировка - возвращает только основные сообщения отсортированы по заданым параметрам: в поле userEmailDate можно выбрать критерий сортировки(по имени пользователя user.username, имейлу user.email, дате date) и выбрать в каком порядке они будут отображены( по убыванию DESC, по возрастанию ASC) 
![image](https://github.com/verenichvs/spa-back/assets/115184978/b7bb1f60-863f-4c84-bac1-19b406ff3e19)


- страница комментариев - вам возвращается древо сообщений с его дочерними коментариями. неопходимо заполнить поля как на картинке:
-
-   ![image](https://github.com/verenichvs/spa-back/assets/115184978/9ed9fe70-f743-48e4-a099-67e336c20fb2)








