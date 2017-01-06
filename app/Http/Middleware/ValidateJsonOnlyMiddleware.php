<?php
/**
 * Created by PhpStorm.
 * User: robert.asproniu
 * Date: 1/3/2017
 * Time: 5:10 PM
 */


namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\Response;


class ValidateJsonOnlyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $requestData = $request->getContent();

        if (empty($request->wantsJson()) || (!empty($requestData) && json_decode($requestData) === null))
        {
            throw new \Exception("Only JSON format", 400);
        }

        $response = $next($request);

        $responseContent  = !empty($response->original) ? $response->original : null;

        $response->setContent([
            'success'   => $response->getStatusCode() != 200 ? false: true,
            'response'  => $responseContent
        ]);

        return $response;
    }
}