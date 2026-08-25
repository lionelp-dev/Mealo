<?php

namespace App\Enums;

enum IngredientCategoryEnum: string
{
    case Fruits = 'fruits';
    case FreshVegetablesAndHerbs = 'legumes-herbes-fraiches';
    case Meats = 'viandes';
    case DeliMeats = 'charcuterie';
    case FishAndSeafood = 'poissons-fruits-de-mer';
    case Eggs = 'oeufs';
    case DairyProducts = 'produits-laitiers';
    case PlantBasedAlternatives = 'alternatives-vegetales';
    case BreadAndBakery = 'pains-produits-boulangerie';
    case PastaRiceAndCereals = 'pates-riz-cereales';
    case Legumes = 'legumineuses';
    case FloursAndBakingAids = 'farines-aides-patisserie';
    case NutsSeedsAndDriedFruits = 'noix-graines-fruits-secs';
    case CansAndJars = 'conserves-bocaux';
    case OilsAndVinegars = 'huiles-vinaigres';
    case SaucesAndCondiments = 'sauces-condiments';
    case DriedHerbsAndSpices = 'herbes-sechees-epices';
    case SavoryGroceries = 'epicerie-salee';
    case SweetGroceries = 'epicerie-sucree';
    case FrozenProducts = 'produits-surgeles';
    case Drinks = 'boissons';
    case PreparedProducts = 'produits-prepares';
    case Other = 'autres';

    public function label(): string
    {
        return match ($this) {
            self::Fruits => 'Fruits',
            self::FreshVegetablesAndHerbs => 'Légumes et herbes fraîches',
            self::Meats => 'Viandes',
            self::DeliMeats => 'Charcuterie',
            self::FishAndSeafood => 'Poissons et fruits de mer',
            self::Eggs => 'Œufs',
            self::DairyProducts => 'Produits laitiers',
            self::PlantBasedAlternatives => 'Alternatives végétales',
            self::BreadAndBakery => 'Pains et produits de boulangerie',
            self::PastaRiceAndCereals => 'Pâtes, riz et céréales',
            self::Legumes => 'Légumineuses',
            self::FloursAndBakingAids => 'Farines et aides à la pâtisserie',
            self::NutsSeedsAndDriedFruits => 'Noix, graines et fruits secs',
            self::CansAndJars => 'Conserves et bocaux',
            self::OilsAndVinegars => 'Huiles et vinaigres',
            self::SaucesAndCondiments => 'Sauces et condiments',
            self::DriedHerbsAndSpices => 'Herbes séchées et épices',
            self::SavoryGroceries => 'Épicerie salée',
            self::SweetGroceries => 'Épicerie sucrée',
            self::FrozenProducts => 'Produits surgelés',
            self::Drinks => 'Boissons',
            self::PreparedProducts => 'Produits préparés',
            self::Other => 'Autres',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
