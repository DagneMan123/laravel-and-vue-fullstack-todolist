<?php

// Quick diagnostic routes to test database connection and stats
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Task;

Route::get('/diagnostic/db-test', function () {
    try {
        $result = DB::connection()->getPdo();
        return response()->json(['status' => 'Database connected successfully', 'result' => 'PDO instance created']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'Database connection failed', 'error' => $e->getMessage()], 500);
    }
});

Route::get('/diagnostic/tables', function () {
    try {
        $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        return response()->json(['status' => 'success', 'tables' => $tables]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'error' => $e->getMessage()], 500);
    }
});

Route::get('/diagnostic/users', function () {
    try {
        $count = User::count();
        return response()->json(['status' => 'success', 'user_count' => $count]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'error' => $e->getMessage()], 500);
    }
});

Route::get('/diagnostic/tasks', function () {
    try {
        $count = Task::count();
        $tasks = Task::with('user')->limit(5)->get();
        return response()->json(['status' => 'success', 'task_count' => $count, 'sample' => $tasks]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'error' => $e->getMessage()], 500);
    }
});
