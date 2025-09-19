<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PageController extends Controller
{
    public function show($slug)
    {
        $page = DB::selectOne(
            "SELECT * FROM services WHERE slug = ? LIMIT 1",
            [$slug]
        );

        if (!$page) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }
}
