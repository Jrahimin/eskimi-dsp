<?php

namespace App\Services;

use App\Entities\CommonResponseEntity;
use App\Http\Requests\Api\CampaignAddRequest;
use App\Models\Campaign;
use App\Repositories\CampaignRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
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


        $campaign = $response->data;
        try{
            $uploadData = $this->getUploadData($request, $campaign);

            if($uploadData){
                $uploadResponse = $this->campaignRepository->saveCreativeUploads($uploadData);
                if($uploadResponse->status != 200){
                    $campaign->delete();
                    $response->errorMessage = $this->exceptionMessage;
                    $response->status = $this->exceptionStatus;
                }
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
            $data = $this->campaignRepository->updateCampaign($request, $campaign);

            $response->data = $data;
            $response->status = 200;

            return $response;
        } catch (\Throwable $ex) {
            Log::error(' : Found Exception [Script: ' . __CLASS__ . '@' . __FUNCTION__ . '] [Origin: ' . $ex->getFile() . '-' . $ex->getLine() . ']' . $ex->getMessage());
            $response->errorMessage = $this->exceptionMessage;
            $response->status = $this->exceptionStatus;

            return $response;
        }
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
