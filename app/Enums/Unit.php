<?php

namespace App\Enums;

enum Unit: string
{
    // Volume - Metric
    case Milliliter = 'ml'; // Millilitre
    case Centiliter = 'cl'; // Centilitre
    case Deciliter = 'dl'; // Décilitre
    case Liter = 'l'; // Litre

    // Volume - Imperial/US
    case Teaspoon = 'tsp'; // Cuillère à café
    case Tablespoon = 'tbsp'; // Cuillère à soupe
    case FluidOunce = 'fl oz'; // Once liquide
    case Cup = 'cup'; // Tasse
    case Pint = 'pint'; // Pinte
    case Quart = 'quart'; // Quart
    case Gallon = 'gallon'; // Gallon

    // Weight - Metric
    case Milligram = 'mg'; // Milligramme
    case Gram = 'g'; // Gramme
    case Kilogram = 'kg'; // Kilogramme

    // Weight - Imperial/US
    case Ounce = 'oz'; // Once
    case Pound = 'lb'; // Livre

    // Quantity
    case Piece = 'piece'; // Pièce
    case Pinch = 'pinch'; // Pincée
    case Dash = 'dash'; // Trait
    case Handful = 'handful'; // Poignée
    case Slice = 'slice'; // Tranche
    case Clove = 'clove'; // Gousse
    case Bunch = 'bunch'; // Botte
    case Package = 'package'; // Paquet
    case Can = 'can'; // Boîte de conserve
    case Jar = 'jar'; // Pot
    case Bottle = 'bottle'; // Bouteille
    case Box = 'box'; // Boîte
    case Bag = 'bag'; // Sachet

    // Special
    case ToTaste = 'to taste'; // Au goût
    case AsNeeded = 'as needed'; // Selon les besoins

    public function label(): string
    {
        return match ($this) {
            self::Milliliter => 'Milliliter (ml)',
            self::Centiliter => 'Centiliter (cl)',
            self::Deciliter => 'Deciliter (dl)',
            self::Liter => 'Liter (l)',
            self::Teaspoon => 'Teaspoon (tsp)',
            self::Tablespoon => 'Tablespoon (tbsp)',
            self::FluidOunce => 'Fluid Ounce (fl oz)',
            self::Cup => 'Cup',
            self::Pint => 'Pint',
            self::Quart => 'Quart',
            self::Gallon => 'Gallon',
            self::Milligram => 'Milligram (mg)',
            self::Gram => 'Gram (g)',
            self::Kilogram => 'Kilogram (kg)',
            self::Ounce => 'Ounce (oz)',
            self::Pound => 'Pound (lb)',
            self::Piece => 'Piece',
            self::Pinch => 'Pinch',
            self::Dash => 'Dash',
            self::Handful => 'Handful',
            self::Slice => 'Slice',
            self::Clove => 'Clove',
            self::Bunch => 'Bunch',
            self::Package => 'Package',
            self::Can => 'Can',
            self::Jar => 'Jar',
            self::Bottle => 'Bottle',
            self::Box => 'Box',
            self::Bag => 'Bag',
            self::ToTaste => 'To taste',
            self::AsNeeded => 'As needed',
        };
    }

    public function isVolume(): bool
    {
        return in_array($this, [
            self::Milliliter,
            self::Centiliter,
            self::Deciliter,
            self::Liter,
            self::Teaspoon,
            self::Tablespoon,
            self::FluidOunce,
            self::Cup,
            self::Pint,
            self::Quart,
            self::Gallon,
        ]);
    }

    public function isWeight(): bool
    {
        return in_array($this, [
            self::Milligram,
            self::Gram,
            self::Kilogram,
            self::Ounce,
            self::Pound,
        ]);
    }

    public function isQuantity(): bool
    {
        return in_array($this, [
            self::Piece,
            self::Pinch,
            self::Dash,
            self::Handful,
            self::Slice,
            self::Clove,
            self::Bunch,
            self::Package,
            self::Can,
            self::Jar,
            self::Bottle,
            self::Box,
            self::Bag,
        ]);
    }

    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->all();
    }
}
