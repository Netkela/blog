---
metatitle: FastPanel не может выпустить SSL сертификат - certificate cannot be issued as URL
title: FastPanel не может выпустить SSL сертификат
description: Показываю как исправить ошибку «certificate cannot be issued as URL» в FastPanel при выпуске SSL сертификата.
aliases:
  - FastPanel не может выпустить SSL сертификат
date: 2025-02-17
tags: 
draft: true
---
Я уже рассказывал, [[ustanovka-fastpanel|как установить бесплатную панель управления сайтами FastPanel]]. Я ее использую уже давно и никогда не было проблем. Но недавно на новом сервере при выпуске SSL сертификата Lets Encrypt в FastPanel возникла такая ошибка «certificate cannot be issued as URL».

<img src="https://files.netkela.ru/img/articles/razrabotka/fastpanel-oshibka-ssl/error-ssl-fastpanel.webp" alt="Ошибка certificate cannot be issued as URL в Fastpanel">

Полдня потратил, чтобы найти решение и нашел его. Пишу статью, чтобы сэкономить время, если вдруг у вас будет такая же проблема.

Ошибка заключалась в следующем. Если выпустить SSL сертификат Lets Encrypt для одного домена, то получим ошибку, если попробуем выпустить для другого домена, то SSL сертификат нормально выпускается. Оказывается, связана эта ошибка с тем, что когда вы покупаете сервер VPS, то в указываете доменное имя этого сервера. Его записи попадают в файл /etc/host и вы не сможете выдать SSL сертификат именно на этот домен, который указан, как серверный. На другие домены выдача сертификата происходит нормально.

Я написал в поддержку FastPanel с этой проблемой, они подтвердили, что исправлять нужно файл /etc/hosts.

<img src="https://files.netkela.ru/img/articles/razrabotka/fastpanel-oshibka-ssl/otvet-podderzhki-fastpanel.webp" alt="Ответ поддержки Fastpanel по поводу ошибки этой ошибки">

Для того, чтобы изменить hosts:

1) Открываем терминал через программу Putty или [Bitvise Client SSH](https://bitvise.com/download-area) указав свои данные от сервера — host, username, password:

<img src="https://files.netkela.ru/img/articles/razrabotka/fastpanel-oshibka-ssl/bitvise-terminal.webp" alt="Настраиваем bitvise для входа в терминал">

2) Вводим команду:

```
sudo nano /etc/hosts
```

3) Попадаем в файл hosts, он у меня выглядит вот так:

<img src="https://files.netkela.ru/img/articles/razrabotka/fastpanel-oshibka-ssl/hosts-bilo.webp" alt="Как выглядит файл hosts изначально">

4) Удаляем вторую и последнюю строчку с доменом, нажимаем CTRL+O и потом Enter, чтобы сохранить изменения.

<img src="https://files.netkela.ru/img/articles/razrabotka/fastpanel-oshibka-ssl/del-domen-hosts.webp" alt="Удаляем строчки из hosts">

5) А потом CTRL+X, чтобы выйти в терминала. Теперь терминал можно закрыть.

Теперь проверяем, сертификат должен выпуститься нормально.

Не забудьте также [[zashita-fastpanel|защитить свою FastPanel от злоумышленников]].