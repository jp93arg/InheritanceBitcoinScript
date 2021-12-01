🇬🇧
# Bitcoin Inheritance Scripts

This repository aims to demonstrate how easy is to program different use cases on bitcoin like inheritance, future backups, etc.
Hopefully, this kind of setups will become easier and more user-friendly as different wallets implement it.

Before getting into the scripts, I'll suggest getting familiar with the following concepts:
1. Multisignature
2. Time locked transactions
3. Bitcoin Scripting Language (I would recommend this: https://www.youtube.com/watch?v=yU3Sr07Qnxg)

In this first example, we'll create an address, who's balance could be spent by the owner at any point in time, or by the inheritor, after the specified time.
This setup is also very useful to create future backups.

## What do we mean by "future backups"?
You should know you need to backup your seed phrase in order to recover your funds if needed. But, what if I tell you that you can create a second seed phrase that will give you access to your funds in case you need it, but you can set an activation time on that second seed phrase?
You could create this kind of setup and store the second seed phrase in a non-secure location, for example, in your bank safe deposit box.

But, what if someone opens the safe box and gets the second seed phrase? Well, the second seed phrase and their private key associated with it, it's not allowed (by the bitcoin consensus rules) to spend your utxo/money YET.

What you should do is, if you still have access to your primary seed phrase/private key, create a new pair and move your funds there, before the second key gets activated. Then you can go to your bank and replace the old (and un-usable) second seed phrase with your new second seed phrase (which is not "activated" yet).
If you loose access to the main seed phrase and you need to recover your funds, all you need to do is to go to the bank, get your second key and spend your funds after it gets activated (maybe you'll need to wait a couple of months... but isn't it better than loosing your funds?)

Let's say you do this operation once a year. Unfortunately, let's suppose you die. Someone from your family that has access to your bank safe box, could have access to the second seed phrase, wait until it gets "activated", and recover the funds. You can also create a transaction that spends the funds using the backup key, and give it to your relative. That transaction won't be valid until the time you specified in the timelock. And won't access the funds if you renew the configuration by creating a new pair, or spend your funds. You can give someone else future access to your money, but you're in full control of it at any point in time. You don't need to trust this person with your current private keys, and there is no risk to lose your funds.

In this kind of setup there is no middle-man, no attorney needed. Programmable inheritance in the bitcoin network.

Example:
## Creating and funding the Script:
![image](https://user-images.githubusercontent.com/33181203/144312327-95ff1fd0-e4d7-449d-8fe5-46f995c91398.png)

![image](https://user-images.githubusercontent.com/33181203/144312363-cf2f85ac-cb4b-4937-b06b-a7461eb1be6f.png)

![image](https://user-images.githubusercontent.com/33181203/144312437-cd8493ff-0a29-4888-84bd-16f38f38205f.png)

![image](https://user-images.githubusercontent.com/33181203/144312468-dd9723e3-13b2-400c-a796-4692d49af999.png)

## Spending as the owner
![image](https://user-images.githubusercontent.com/33181203/144312560-dc86f6e9-9d83-4193-8bde-59ff3224ee1b.png)

![image](https://user-images.githubusercontent.com/33181203/144312581-da1e96eb-f7bf-49ac-b085-d06c60b62e0c.png)

![image](https://user-images.githubusercontent.com/33181203/144312615-eb54400f-8c8b-4e66-ad2d-b8841775f4c8.png)

## Trying to spend with the second key before it gets activated
![image](https://user-images.githubusercontent.com/33181203/144312698-bab016c6-2c51-4983-af49-ff1dc1379112.png)

![image](https://user-images.githubusercontent.com/33181203/144312720-e187c3a8-639e-4ff5-8dd6-5e64a776986e.png)

![image](https://user-images.githubusercontent.com/33181203/144312745-c7ba613c-514a-4436-840e-3bd12c73c48a.png)

![image](https://user-images.githubusercontent.com/33181203/144312787-5730a216-d178-4744-9750-1c0a37cd7c74.png)

![image](https://user-images.githubusercontent.com/33181203/144312809-9ebce5a4-6e3c-4d25-ba69-1b258f15c2e9.png)


## Spending with the second key once it gets activated
![image](https://user-images.githubusercontent.com/33181203/144312912-2db3d57f-936b-451f-9269-2240399a5254.png)

![image](https://user-images.githubusercontent.com/33181203/144312979-5887221c-a9cf-48f8-aa9f-1eb6fb51195f.png)

Before activation:
![image](https://user-images.githubusercontent.com/33181203/144313025-ce2fc989-e2bd-4de1-a2f6-3b24852bff01.png)

After activation:
![image](https://user-images.githubusercontent.com/33181203/144313073-fcfd3572-9d28-4839-9398-4aea1dcb858f.png)


🇪🇸
# Scripts de herencia en Bitcoin

Este repositorio tiene como objetivo demostrar lo fácil que es programar distintos casos de uso en bitcoin, por ejemplo, herencia, backups a futuro, etc.
Espero que en un futuro este tipo de configuraciones se vuelvan mas comunes, y amigables a los usuarios finales, a medida que diferentes wallets con buen UI/UX implementen este tipo de prácticas.

Antes de comenzar a analizar los scripts, sugiero familiarizarse con los siguientes conceptos:
1. Multisignature
2. Transacciones con bloqueo temporal
3. El lenguaje de scripting de Bitcoin (recomiendo este video: https://www.youtube.com/watch?v=yU3Sr07Qnxg)

En el primer ejemplo, vamos a crear una direccion, cuyo balance puede ser gastado por el dueño original en cualquier momento, o por su heredero, luego de un tiempo especificado. Este setup tambien es útil para crear backup futuros.

## A que nos referimos con "backup futuros"?
Seguramente sepas que debes tomar un respaldo/backup de la frase semilla (12 o 24 palabras, dependiendo de la implementación de la wallet) para poder recuperar el acceso a los fondos en caso de necesitarlo. Pero, y si te digo que podrias crear también una segunda frase que te daria acceso a los fondos en caso de que no puedas recuperar el backup de la primera? Esta segunda frase puede activarse en un momento futuro pre-definido.

Podrias guardar esta segunda frase en una ubicación no segura, por ejemplo, en la caja de seguridad de un banco.

Pero que pasaria si alguien tiene acceso a la caja de seguridad del banco y obtiene la segunda frase? Bueno, la segunda frase y su clave privada asociada, no esta autorizada (por las reglas de consenso de Bitcoin) a gastar los fondos AÚN.

En un caso asi, lo que deberias hacer es: Si todavia tenes acceso a la clave primaria, deberias crear un nuevo par de claves, y mover los fondos a esa dirección, antes de que la segunda clave se "active". Luego, podrias ir al banco y reemplazar la antigua segunda clave (que ya no sirve para nada) por una nueva segunda clave (que aun no sirve para nada). Si perdes acceso al backup principal y necesitas recuperar acceso a los fondos, solo tendrias que ir al banco y obtener la segunda clave (al banco porque en este ejemplo usamos el banco, cada uno sabra donde dejar esta segunda clave) y usarla cuando llegue el momento. Quizas debas esperar unos minutos/horas/dias/meses hasta que esta segunda clave sea útil, pero es mejor eso que perder acceso a los fondos, no?

Supongamos que realizas esta operacion de reemplazo de claves una vez al año. Lamentablemente, en algun momento te moris, pero alguien de tu familia que tenga acceso al a caja de seguridad del banco, podria acceder a la segunda clave, esperar a que se "active" y recuperar los fondos.

Tambien podrias dejar creada una transaccion que gasta los fondos usando la clave de backup y dejar esta transaccion ya firmada a un familiar. La transacción no va a ser válida hasta que llegue el momento especificado o si los fondos son gastados previamente. Podrias dejarle a algún (o varios) ser querido tu herencia, sin dejar de tener control total de los fondos en todo momento (mientras estes vivo!) No necesitas confiar tus claves privadas y mucho menos tus bitcoin a terceros de confianza y mitigas los riesgos de perder los fondos.

Este tipo de configuración no necesita intermediarios, ni abogados, ni nada. Herencia programable en la red de bitcoin.
