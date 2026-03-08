<?php

/**
 * Pest IDE Helper Stubs
 * These stubs help Phpactor recognize Pest's global functions
 */

namespace {
    /**
     * Define a test case
     *
     * @param string|null $description
     * @param \Closure(Tests\TestCase):void|null $closure The test closure where $this is bound to Tests\TestCase
     */
    function test(string $description = null, \Closure $closure = null): mixed {}

    /**
     * Define a test case (alias of test)
     *
     * @param string|null $description
     * @param \Closure(Tests\TestCase):void|null $closure The test closure where $this is bound to Tests\TestCase
     */
    function it(string $description = null, \Closure $closure = null): mixed {}

    /**
     * Create an expectation
     */
    function expect(mixed $value): mixed {}

    /**
     * Define a test suite
     */
    function describe(string $description, \Closure $tests): mixed {}

    /**
     * Define a dataset
     */
    function dataset(string $name, iterable|callable $dataset): mixed {}

    /**
     * Skip a test
     */
    function skip(string $description = null, \Closure $closure = null): mixed {}

    /**
     * Mark a test as a todo
     */
    function todo(string $description = null, \Closure $closure = null): mixed {}

    /**
     * Configure Pest
     */
    function pest(): mixed {}

    /**
     * Run code before each test
     */
    function beforeEach(\Closure $closure): mixed {}

    /**
     * Run code after each test
     */
    function afterEach(\Closure $closure): mixed {}

    /**
     * Run code before all tests
     */
    function beforeAll(\Closure $closure): mixed {}

    /**
     * Run code after all tests
     */
    function afterAll(\Closure $closure): mixed {}

    /**
     * Set test as only to run
     */
    function only(string $description = null, \Closure $closure = null): mixed {}

    /**
     * Add test uses trait
     */
    function uses(string ...$uses): mixed {}
}
