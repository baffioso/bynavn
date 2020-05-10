# Endelser på bynavne
En række endelser går i igen i danske bynavne og denne løsning viser, hvordan nogle af de mest brugte fordeler sig geografisk i Danmark.
16 af mest hyppige endelser som fx 'rup', 'by', 'huse', er lavet som en menu i højre side. Ved at køre musen henover endelser, så vil bynavne med disse endelser blive highligthet på kortet. Man kan også også sætte flueben af i de endelser man ønsker at se på kortet. Fx vises kun 'rup' (mest hyppige endelse i Danmark) som 1296 byer i Danmark ender på, så vil man se på kortet at Bornholm ikke har nogen byer der ender på 'rup'. Man kan køre musen henover en prik på kortet og få navnet på byen angivet i en popup.

Søgefeltet oppe i højre side søger blandt Danmarks 7977 byer. Søgningen er højre/venstre wildcard. Fx søges der på 'lund', så fremkommer byer som Lundtofte, Skovlunde, Krogenlund osv.
Søgningen tager ikke hensyn til store og små bogstaver, så 'LUND' eller 'lund' giver det samme søgeresultat. Tallet, der fremkommer ved en wildcard søgning til højre for søgefeltet, det angiver hvor mange reslutater der findes i kortetudsnittet. Så zoomer man ind/hen andet sted i Danmark så vil det tal ændre sig hele tiden<br>

Bemærk at fx Hellerup ved København ikke dukker op ved 'rup', dette skyldes at Hellerup er officielt defineret som en bydel og ikke en by. Der er en del af disse stednavne som man måske forventer er en by, men er defineret som bydel.  
![bynavne demo](demo.gif "bynavne demo")

Når der zoomes ind og rundt, så ændre URL'ens parametre sig hele tiden. Dette kan bruges til fx at man ønsker at sende et link over Nordjylland til til andre.  
Visualiseringen er blevet testet og virker i følgende browsere Firefox, Chrome og Microsoft Edge.
## Data

Data kommer fra stednavnedatabasen som er hentet fra [Kortforsyningen](https://download.kortforsyningen.dk/)

## Inspiration
https://tobiaskauer.org/projects/end/
