<?php

namespace Tests\Feature;

use App\Mail\BetaRequestConfirmationMail;
use App\Models\BetaRequest;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

describe('Beta Request Submission', function () {
    beforeEach(function () {
        Mail::fake();
    });

    it('requires an email address', function () {
        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => "L'adresse email est requise."]);
    });

    it('requires a valid email format', function () {
        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'invalid-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => "L'adresse email doit être valide."]);
    });

    it('rejects email longer than 255 characters', function () {
        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => str_repeat('a', 250).'@test.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => "L'adresse email ne doit pas dépasser 255 caractères."]);
    });

    it('prevents duplicate beta requests with pending status', function () {
        BetaRequest::factory()->create([
            'email' => 'test@example.com',
            'status' => 'pending',
        ]);

        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'test@example.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'Cette adresse email a déjà été enregistrée.']);
    });

    it('prevents duplicate beta requests with approved status', function () {
        BetaRequest::factory()->approved()->create([
            'email' => 'test@example.com',
        ]);

        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'test@example.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'Cette adresse email a déjà été enregistrée.']);
    });

    it('allows beta request for previously rejected email', function () {
        BetaRequest::factory()->rejected()->create([
            'email' => 'test@example.com',
        ]);

        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'test@example.com',
        ]);

        $response->assertRedirect();
        expect(BetaRequest::query()->where('email', 'test@example.com')->count())->toBe(2);
    });

    it('prevents beta request for existing user emails', function () {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'existing@example.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'Cette adresse email a déjà été enregistrée.']);
    });

    it('stores beta request with correct data', function () {

        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'new@example.com',
        ]);

        $response->assertRedirect();

        $betaRequest = BetaRequest::query()->where('email', 'new@example.com')->first();

        expect($betaRequest)->not->toBeNull()
            ->and($betaRequest->status)->toBe('pending')
            ->and($betaRequest->ip_address)->not->toBeNull()
            ->and($betaRequest->user_agent)->not->toBeNull();
    });

    it('sends confirmation email after successful submission', function () {
        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'new@example.com',
        ]);

        $response->assertRedirect();

        Mail::assertQueued(BetaRequestConfirmationMail::class, function ($mail) {
            return $mail->hasTo('new@example.com');
        });
    });

    it('returns success message after submission', function () {
        /** @var \TestCase $this */
        $response = $this->postJson('/beta/request', [
            'email' => 'new@example.com',
        ]);

        $response->assertRedirect()
            ->assertSessionHas('success', "Merci ! Votre demande d'accès a bien été enregistrée. Vous recevrez un email si votre demande est approuvée.");
    });

    it('rate limits beta request submissions', function () {
        // Make 5 successful requests (the limit)
        /** @var \TestCase $this */
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/beta/request', [
                'email' => "test{$i}@example.com",
            ])->assertRedirect();
        }

        // 6th request should be rate limited
        $response = $this->postJson('/beta/request', [
            'email' => 'test6@example.com',
        ]);

        $response->assertStatus(429); // Too Many Requests
    });
});
