<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CreativeUpload;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignCreateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $today = Carbon::now()->format('Y-m-d H:i:s');

        DB::beginTransaction();

        $campaign = Campaign::create([
            'name' => 'test campaign',
            'daily_budget' => 1000,
            'total_budget' => 25000,
            'from_date' => $today,
            'to_date' => Carbon::now()->addDays(10)->format('Y-m-d H:i:s'),
        ]);

        CreativeUpload::insert(
            [
                'campaign_id' => $campaign->id,
                'file_path' => public_path('uploads/demo_1.jpg'),
                'created_at' => $today
            ],
            [
                'campaign_id' => $campaign->id,
                'file_path' => public_path('uploads/demo_2.jpg'),
                'created_at' => $today
            ]
        );

        DB::commit();
    }
}
