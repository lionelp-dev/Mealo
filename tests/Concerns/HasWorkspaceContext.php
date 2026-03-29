<?php

namespace Tests\Concerns;

use App\Models\Workspace;

trait HasWorkspaceContext
{
    public Workspace $workspace;
}
