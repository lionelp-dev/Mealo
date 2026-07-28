# Domaine métier

## Fonctionnalités principales

| Domaine | Fonctionnalités |
| --- | --- |
| Espaces | Organisation des repas autour d’espaces personnels et partagés. |
| Recettes | Gestion des recettes. |
| Planification hebdomadaire | Planification des repas sur la semaine. |
| Listes de courses | Synchronisation des listes de courses avec les repas planifiés. |
| Intelligence artificielle | Génération de recettes, de visuels et de plannings à partir des recettes existantes. |

## Workspaces

Planifier des repas à plusieurs exige de savoir à quel groupe appartiennent le calendrier, la liste de courses et les permissions. Le workspace fournit cette frontière : 

| Règle | Description |
| --- | --- |
| Workspace par défaut | Le workspace par défaut est créé automatiquement à l’inscription |
| Protection du workspace par défaut | Le workspace par défaut ne peut pas être modifié, supprimé, converti ou utilisé pour inviter des membres. |
| Workspace supplémentaire | Un utilisateur peut créer d’autres workspaces personnels ou partagés.<br>Ils peuvent accueillir des membres avec des permissions différentes.<br>Un workspace non défini comme workspace par défaut peut changer de type |
| Workspace personnel | Convertir un workspace personnel en workspace partagé est autorisé. |
| Workspace partagé | Convertir un workspace partagé en workspace personnel retire tous les membres autres que le propriétaire et supprime les invitations en attente |
| Isolation | Les plannings, listes de courses et permissions sont isolés par workspace. |

Le workspace actif détermine ainsi le contexte collaboratif utilisé par le planning, la liste de courses et les permissions. Ce choix permet à une même personne de passer d’une organisation personnelle à un espace familial ou partagé sans mélanger leurs données.

## Rôles et permissions

Un espace partagé distingue le propriétaire, les personnes qui contribuent au planning et celles qui le consultent. Les rôles traduisent ces niveaux de participation.

| Rôle | Intention |
| --- | --- |
| `owner` | Propriétaire du workspace, responsable de sa gestion principale. |
| `editor` | Membre pouvant contribuer et modifier les contenus autorisés. |
| `viewer` | Membre disposant d’un accès en lecture selon les permissions configurées. |

Les autorisations doivent être vérifiées avant les opérations sensibles :

- création ;
- modification ;
- suppression ;
- invitation ;
- consultation ;
- gestion des membres.

Les permissions collaboratives sont toujours rattachées au workspace concerné. Un rôle obtenu dans un espace n’accorde aucun droit implicite dans un autre.

## Recettes

Une recette est d’abord une création personnelle : elle appartient à son auteur, indépendamment du workspace actif. La rattacher directement à un workspace obligerait à la dupliquer pour la planifier ailleurs. Elle devient donc visible par les membres d’un workspace lorsqu’elle est utilisée dans un repas planifié accessible à ces membres.

Une recette peut contenir :

- un nom ;
- une description ;
- un nombre de portions ;
- un temps de préparation ;
- un temps de cuisson ;
- des ingrédients avec quantités ;
- des étapes de préparation ;
- des tags ou catégories ;
- des moments de repas ;
- une image optionnelle.

Seul le propriétaire peut modifier ou supprimer une recette. Cette propriété stable permet de la réutiliser sans transférer son contrôle. Sa suppression doit aussi supprimer ou synchroniser les données dérivées, notamment les repas planifiés et les listes de courses.

## Repas planifiés

Une recette seule ne dit ni quand elle sera préparée, ni pour combien de personnes. Le repas planifié apporte ce contexte en la plaçant sur un calendrier selon le type de repas.

Un repas planifié relie :

- un utilisateur ;
- un workspace ;
- une recette ;
- un moment de repas ;
- une date ;
- un nombre de portions.

Les repas planifiés servent de base à la génération des listes de courses.

Toute création, modification ou suppression d’un repas planifié doit maintenir la liste de courses de son workspace et de sa semaine cohérente. Le planning devient ainsi la source de vérité de l’organisation hebdomadaire.

## Listes de courses

Reconstituer manuellement les ingrédients ferait perdre le principal bénéfice de la planification. La liste de courses est donc générée automatiquement à partir des repas planifiés d’un workspace pour une semaine donnée.

Les ingrédients sont regroupés et leurs quantités sont recalculées selon le nombre de portions. Leur état coché ou non coché est conservé lors des synchronisations.

La liste de courses n’est pas une saisie indépendante : elle est dérivée du planning. Toute modification du planning ou d’une recette planifiée doit conserver cette cohérence, tout en préservant les éléments déjà cochés pendant une synchronisation.

## Génération IA

Trouver de nouvelles idées ou équilibrer toute une semaine peut devenir aussi laborieux que la planification elle-même. L’application utilise OpenRouter pour assister l’utilisateur dans ces tâches, tout en conservant les mêmes contrats que pour une saisie manuelle.

Usages documentés :

- proposition d’idées de recettes ;
- génération de recettes ;
- génération d’images de recettes ;
- génération d’un planning de repas à partir des recettes existantes, d’une période et d’un nombre de portions.

Les résultats générés restent intégrés au flux applicatif existant : validation, formulaires, autorisations et persistance. L’utilisateur garde ainsi la possibilité de relire et d’adapter une proposition, tandis que l’application conserve une seule manière de créer et de stocker les données.

Les limites actuelles des fonctionnalités IA, notamment la personnalisation du planning et les différences de transport entre générations, sont suivies dans la [dette connue](known-debt.md).

## Bêta et administration

Une phase bêta demande de contrôler les entrées sans confondre demande d’accès et compte actif. Le module bêta recueille cette demande, permet de l’approuver ou de la rejeter, puis transforme l’invitation acceptée en compte utilisateur.

Les comptes bêta peuvent avoir une date d’expiration.

Le module d’administration permet de suivre les demandes, relancer certaines invitations et nettoyer les comptes bêta expirés.

Cette zone reste distincte du flux principal recettes, planning et listes de courses. Elle administre le cycle de vie des accès sans introduire ses règles dans le domaine quotidien des repas.

---

[Sommaire](../README.md#documentation) | [Suivant : Modèle de données](architecture/data-model.md) →
