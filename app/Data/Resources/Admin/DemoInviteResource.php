<?php

namespace App\Data\Resources\Admin;

use App\Models\DemoAccount;
use App\Models\DemoInvite;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DemoInviteResource extends Data
{
    public function __construct(
        public int $id,
        public string $token,
        public ?string $label,
        public int $max_uses,
        public int $used_count,
        public ?CarbonImmutable $expires_at,
        public bool $is_active,
        public bool $is_usable,
        public string $url,

        /** @var Collection<int, DemoAccountResource> */
        #[LiteralTypeScriptType('Array<DemoAccountResource>')]
        public Collection $demo_accounts,
    ) {}

    public static function fromModel(DemoInvite $invite): self
    {
        return new self(
            id: $invite->id,
            token: $invite->token,
            label: $invite->label,
            max_uses: $invite->max_uses,
            used_count: $invite->used_count,
            expires_at: $invite->expires_at,
            is_active: $invite->is_active,
            is_usable: $invite->isUsable(),
            url: route('demo.enter', $invite->token),
            demo_accounts: $invite->demoAccounts->map(
                fn (DemoAccount $account) => DemoAccountResource::fromModel($account)
            ),
        );
    }
}
