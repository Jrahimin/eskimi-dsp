<?php

namespace App\Services;

use App\Entities\CommonResponseEntity;
use App\Http\Requests\Api\CampaignAddRequest;
use App\Models\Campaign;
use App\Models\CreativeUpload;
use App\Repositories\CampaignRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class CampaignService
{
    protected $campaignRepository;

    public function __construct(CampaignRepository $campaignRepository)
    {
        $this->campaignRepository = $campaignRepository;
        $this->exceptionMessage = "Something went wrong. Please try again later.";
        $this->exceptionStatus = 500;
    }

    public function getCampaigns($id=null): CommonResponseEntity{
        $response = new CommonResponseEntity();
        try {
            $data = $this->campaignRepository->getCampaigns($id);

            $response->data = $data;
            $response->path = URL::to('uploads')."/";
            $response->status = 200;

            return $response;
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
    }

    public function addCampaign(CampaignAddRequest $request): CommonResponseEntity{
        $response = $this->campaignRepository->addCampaign($request);
        if($response->status !=200)
            return $response;

        Cache::forget('campaigns'); //removed cache to fetch list with added campaign

        $campaign = $response->data;
        try{
            $uploadData = $this->getUploadData($request, $campaign);

            if($uploadData){
                $this->campaignRepository->saveCreativeUploads($uploadData);
            }
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());

            $campaign = $response->data;
            $campaign->delete();

            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;
        }

        return $response;
    }

    public function updateCampaign(Request $request, Campaign $campaign): CommonResponseEntity{
        $response = new CommonResponseEntity();
        try {
            $this->campaignRepository->updateCampaign($request, $campaign);
            Cache::forget('campaigns'); //removed cache to fetch list with updated campaign

            $response->status = 200;
            return $response;
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
    }

    public function addCampaignUploads($request): CommonResponseEntity{
        $response = new CommonResponseEntity();
        try{
            $campaign = Campaign::findOrFail($request->id);
            $uploadData = $this->getUploadData($request, $campaign);

            if($uploadData){
                $this->campaignRepository->saveCreativeUploads($uploadData);
            }

            Cache::forget('campaigns'); //removed cache to fetch list with uploaded campaign files

            $response->status = 200;
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());

            $campaign = $response->data;
            $campaign->delete();

            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;
        }

        return $response;
    }

    public function deleteUpload($id): CommonResponseEntity{
        $response = new CommonResponseEntity();
        try{
            $upload = CreativeUpload::findOrFail($id);
            $path = "uploads/".$upload->file_path;
            if(File::exists($path)){
                File::delete($path);
            }

            $upload->delete();

            Cache::forget('campaigns'); //removed cache to fetch list with deleted campaign files

            $response->status = 200;
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());

            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;
        }

        return $response;
    }

    protected function getUploadData(Request $request, $campaign){
        $today = Carbon::now()->format('Y-m-d H:i:s');
        $uploadData = [];

        foreach ($request->file('files') as $file)
        {
            $fileName = Uuid::uuid4()."_".Str::random(4).".".$file->getClientOriginalExtension();

            $uploadData[] = array(
                'campaign_id' => $campaign->id,
                'file_path' => $fileName,
                'created_at' => $today
            );

            $file->move(public_path('uploads'), $fileName);
        }

        return $uploadData;
    }
}
