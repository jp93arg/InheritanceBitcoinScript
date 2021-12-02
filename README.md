🇬🇧
# Bitcoin Inheritance Scripts

This repository aims to demonstrate how easy is to program different use cases on bitcoin like inheritance, future backups, etc.
Hopefully, this kind of setup will become easier and more user-friendly as different wallets implement it.

Before getting into the scripts, I'll suggest getting familiar with the following concepts:
1. Multisignature
2. Time locked transactions
3. Bitcoin Scripting Language (I would recommend this: https://www.youtube.com/watch?v=yU3Sr07Qnxg)

In this first example, we'll create an address, whose balance could be spent by the owner at any point in time, or by the inheritor, after the specified time.
This setup is also very useful to create future backups.

## What do we mean by "future backups"?
You should know you need to backup your seed phrase in order to recover your funds if needed. But, what if I tell you that you can create a second seed phrase that will give you access to your funds in case you need it, but you can set an activation time on that second seed phrase?
You could create this kind of setup and store the second seed phrase in a non-secure location, for example, in your bank safe deposit box.

But, what if someone opens the safe box and gets the second seed phrase? Well, the second seed phrase and their private key associated with it, it's not allowed (by the bitcoin consensus rules) to spend your utxo/money YET.

What you should do is, if you still have access to your primary seed phrase/private key, create a new pair and move your funds there, before the second key gets activated. Then you can go to your bank and replace the old (and un-usable) second seed phrase with your new second seed phrase (which is not "activated" yet).
If you lose access to the main seed phrase and you need to recover your funds, all you need to do is to go to the bank, get your second key and spend your funds after it gets activated (maybe you'll need to wait a couple of months... but isn't it better than losing your funds?)

Let's say you do this operation once a year. Unfortunately, let's suppose you die. Someone from your family that has access to your bank safe box, could have access to the second seed phrase, wait until it gets "activated", and recover the funds. You can also create a transaction that spends the funds using the backup key, and give it to your relative. That transaction won't be valid until the time you specified in the timelock. And won't access the funds if you renew the configuration by creating a new pair, or spend your funds. You can give someone else future access to your money, but you're in full control of it at any point in time. You don't need to trust this person with your current private keys, and there is no risk to lose your funds.

In this kind of setup, there is no middle-man, no attorney needed. Programmable inheritance in the bitcoin network.

# Example, evidence and How to run it:
## Clone the repo and install dependencies
`git clone https://github.com/jp93arg/InheritanceBitcoinScript.git`

`cd InheritanceBitcoinScript`

`npm install`
## Creating the example wallets:
`node CreateWallets.js`

## Creating and funding the Script:
`node CreateInheritanceMultisigUTXO.js --locktime UNIX_TIMESTAMP_FOR_INHERITANCE_ACTIVATION`
This will give you the address where you can send funds and the witness script you'll need to create the spending transaction.
Open your favorite node interface and send some sats to the address. In this case, I'm using Bitcoin Core in regtest mode.
Bitcoin core returns the transaction ID, but we'll need some extra details, you'll have to run the getrawtransaction command:
getrawtransaction TX_ID true

![image](https://user-images.githubusercontent.com/33181203/144312327-95ff1fd0-e4d7-449d-8fe5-46f995c91398.png)

![image](https://user-images.githubusercontent.com/33181203/144312363-cf2f85ac-cb4b-4937-b06b-a7461eb1be6f.png)

![image](https://user-images.githubusercontent.com/33181203/144312437-cd8493ff-0a29-4888-84bd-16f38f38205f.png)

![image](https://user-images.githubusercontent.com/33181203/144312468-dd9723e3-13b2-400c-a796-4692d49af999.png)

In the spending cases we'll need the following parameters:
_witness_: the value for this parameter is printed out when executing the CreateInheritanceMultisigUTXO script.
_inputTxId_: the id returned by bitcoin core once we send funds using the sendtoaddress command suggested by the CreateInheritanceMultisigUTXO script output.
_inputTxIndex_: Transactions in bitcoin have inputs and outputs (except the coinbase transactions at the beginning of each block, those transactions only have the output defined, since there are new coins being generated). We'll need to identify the output from the funding transaction that can be spent by the owner/inheritor. (search for inputTxIndex, I pointed it in the transaction example where to find it.
_txHex_: The funding transaction in hexadecimal. search for "txHex", I pointed out in the. example where to find it.
_locktime_: The locktime we used in the CreateInheritanceMultisigUTXO script.
_outputValue_: The bitcoin amount we want to get out of the funding transaction. We should leave something for the mining fees. For example, if the funding transaction created a 1.5 btc UTXO, we can take 1.5 minus fees.

Example: 
```sh

￼
sendtoaddress bcrt1qwdracye7xcsk5egjmxyz7pgz3066z0c39l5da2m6ky3vwtfgg22qt7p9a0 1.5
￼
861a8de380b73bc70b44ba6a32a3c3df3692f6469f0885dfec4dc4cb8e42bf2a
￼
getrawtransaction 861a8de380b73bc70b44ba6a32a3c3df3692f6469f0885dfec4dc4cb8e42bf2a true
￼
{
  "txid": "861a8de380b73bc70b44ba6a32a3c3df3692f6469f0885dfec4dc4cb8e42bf2a",
  "hash": "145dcd9e0fb20f590fc87d1cabaa70ebf0ea9e4a9c5547d25d2de5951690c02e",
  "version": 2,
  "size": 382,
  "vsize": 220,
  "weight": 880,
  "locktime": 0,
  "vin": [
    {
      "txid": "bf4bae2f1e74e74cf11272cfa657b264dc9d74abbbec408673378791c84f6bb2",
      "vout": 1,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "txinwitness": [
        "3044022050e3982212a23e6644895895f3569d91cd0763e4d0424a316ca44f81b8c84a880220290d161c1eb540245eeaab8876044d71cf4edcf2df6a1e4f5b6b0853ea0d4f0e01",
        "03b3238269dcab14f6ecad9ec2d6dc88181b7ff49a06de46af32e02fada39debd8"
      ],
      "sequence": 4294967294
    },
    {
      "txid": "58a1cb577c6ff9f84af18bca447bc728fb70a67b809b36b18bb0b6b36a3735ea",
      "vout": 1,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "txinwitness": [
        "30440220045d5920863576c0d88e18be9641aa23d74a8838b1c6428b229ce19f6716669b0220753c456d9b0875b10aade2184ffc40c1fc5b9cc1148ee25a2f3e7a41ff4de84201",
        "0298c342b2652952b6e70a134e305122001ebf7e95db202c4303195190d21ef7b3"
      ],
      "sequence": 4294967294
    }
  ],
  "vout": [
    {
      "value": 1.50000000,
      "n": 0, // this is the inputTxIndex, because we sent 1.5 to this address: bcrt1qwdracye7xcsk5egjmxyz7pgz3066z0c39l5da2m6ky3vwtfgg22qt7p9a0
      // The other output is the difference between the UTXO we used and the one we're creating. It's the transaction "change". It won't be the 0 position in the vout array always. We should not assume, sometimes it can be in a different array position.
      "scriptPubKey": {
        "asm": "0 7347dc133e36216a6512d9882f05028bf5a13f112fe8deab7ab122c72d284294",
        "hex": "00207347dc133e36216a6512d9882f05028bf5a13f112fe8deab7ab122c72d284294",
        "reqSigs": 1,
        "type": "witness_v0_scripthash",
        "addresses": [
          "bcrt1qwdracye7xcsk5egjmxyz7pgz3066z0c39l5da2m6ky3vwtfgg22qt7p9a0"
        ]
      }
    },
    {
      "value": 0.49999015,
      "n": 1,
      "scriptPubKey": {
        "asm": "0 a9c9d5f3632081b14faf7d2a965e87a31c701218",
        "hex": "0014a9c9d5f3632081b14faf7d2a965e87a31c701218",
        "reqSigs": 1,
        "type": "witness_v0_keyhash",
        "addresses": [
          "bcrt1q48yatumryzqmzna0054fvh585vw8qyscyaq6cz"
        ]
      }
    }
  ], // here we'll see the txHex
  "hex": "02000000000102b26b4fc8918737738640ecbbab749ddc64b257a6cf7212f14ce7741e2fae4bbf0100000000feffffffea35376ab3b6b08bb1369b807ba670fb28c77b44ca8bf14af8f96f7c57cba1580100000000feffffff0280d1f008000000002200207347dc133e36216a6512d9882f05028bf5a13f112fe8deab7ab122c72d284294a7ecfa0200000000160014a9c9d5f3632081b14faf7d2a965e87a31c70121802473044022050e3982212a23e6644895895f3569d91cd0763e4d0424a316ca44f81b8c84a880220290d161c1eb540245eeaab8876044d71cf4edcf2df6a1e4f5b6b0853ea0d4f0e012103b3238269dcab14f6ecad9ec2d6dc88181b7ff49a06de46af32e02fada39debd8024730440220045d5920863576c0d88e18be9641aa23d74a8838b1c6428b229ce19f6716669b0220753c456d9b0875b10aade2184ffc40c1fc5b9cc1148ee25a2f3e7a41ff4de84201210298c342b2652952b6e70a134e305122001ebf7e95db202c4303195190d21ef7b300000000"
}
```

## Spending as the owner
`node CreateTxSpendingAsOwner.js --witness witnessScript --inputTxId inputTransactionId --inputTxIndex inputTransactionIndex(our UTXO) --txHex txInHexadecimal --outputValue outputValueInBTC`


![image](https://user-images.githubusercontent.com/33181203/144312560-dc86f6e9-9d83-4193-8bde-59ff3224ee1b.png)

![image](https://user-images.githubusercontent.com/33181203/144312581-da1e96eb-f7bf-49ac-b085-d06c60b62e0c.png)

![image](https://user-images.githubusercontent.com/33181203/144312615-eb54400f-8c8b-4e66-ad2d-b8841775f4c8.png)

## Trying to spend with the second key before it gets activated

`node CreateTxSpendingAsInheritor.js --witness witnessScript --inputTxId inputTransactionId --inputTxIndex inputTransactionIndex(our UTXO) --txHex txInHexadecimal --outputValue outputValueInBTC --locktime lockTimeInEpochSeconds`

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

Supongamos que realizas esta operacion de reemplazo de claves una vez al año. Lamentablemente, en algun momento te moris, pero alguien de tu familia que tenga acceso a la caja de seguridad del banco, podria acceder a la segunda clave, esperar a que se "active" y recuperar los fondos.

Tambien podrias dejar creada una transaccion que gasta los fondos usando la clave de backup y dejar esta transaccion ya firmada a un familiar. La transacción no va a ser válida hasta que llegue el momento especificado o si los fondos son gastados previamente. Podrias dejarle a algún (o varios) ser querido tu herencia, sin dejar de tener control total de los fondos en todo momento (mientras estes vivo!) No necesitas confiar tus claves privadas y mucho menos tus bitcoin a terceros de confianza y mitigas los riesgos de perder los fondos.

Este tipo de configuración no necesita intermediarios, ni abogados, ni nada. Herencia programable en la red de bitcoin.
