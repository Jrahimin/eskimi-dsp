<?php


namespace App\Repositories;


use App\Entities\CommonResponseEntity;
use App\Models\Campaign;
use App\Models\CreativeUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CampaignRepository
{
    protected $exceptionMessage;
    protected $exceptionStatus;

    public function __construct()
    {
        $this->exceptionMessage = "Something went wrong. Please try again later.";
        $this->exceptionStatus = 500;
    }

    public function getCampaigns($id=null){
        $query = Campaign::with('uploads');
        if($id){
            return $query->findOrFail($id);
        }

        return Cache::remember('campaigns', 60, function () use($query){
            return $query->latest()->get();
        });
    }

    public function addCampaign(Request $request)
    {
        $response = new CommonResponseEntity();
        try {
            $campaign = Campaign::create([
                'name' => $request->name,
                'daily_budget' => $request->daily_budget,
                'total_budget' => $request->total_budget,
                'from_date' => $request->from_date,
                'to_date' => $request->to_date,
            ]);

            Cache::forget('campaigns'); //removed cache to fetch list with added campaign

            $response->status = 200;
            $response->data = $campaign;
            return $response;
        } catch (\Throwable $e) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
    }

    public function updateCampaign(Request $request, Campaign $campaign)
    {
        $response = new CommonResponseEntity();
        try {
            $campaign->update([
                'name' => $request->name,
                'daily_budget' => $request->daily_budget ?? null,
                'total_budget' => $request->total_budget ?? null,
                'from_date' => $request->from_date ?? null,
                'to_date' => $request->to_date ?? null,
            ]);

            $response->status = 200;
            $response->data = $campaign;
            return $response;
        } catch (\Throwable $e) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
    }

    public function saveCreativeUploads($uploadData){
        $response = new CommonResponseEntity();
        try{
            CreativeUpload::insert($uploadData);
            $response->status = 200;
            return $response;
        } catch (\Throwable $e){
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
    }

}
