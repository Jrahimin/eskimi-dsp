<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CampaignAddRequest;
use App\Http\Traits\ApiResponseTrait;
use App\Models\Campaign;
use App\Services\CampaignService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CampaignController extends Controller
{
    use ApiResponseTrait;

    protected $campaignService;
    protected $exceptionMessage;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;

        $this->exceptionMessage = "Something went wrong. Please try again later.";
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try{
            $response = $this->campaignService->getCampaigns();

            Log::debug("campaign list response in controller: ".json_encode($response));

            return $this->handleResponse($response, "Campaign list is fetched",true);
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CampaignAddRequest $request)
    {
        try{
            $response = $this->campaignService->addCampaign($request);

            return $this->handleResponse($response, "Campaign has been added successfully");
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try{
            $response = $this->campaignService->getCampaigns($id);

            Log::debug("campaign response in controller: ".json_encode($response));

            return $this->handleResponse($response, "Campaign is fetched",true);
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(CampaignAddRequest $request, Campaign $campaign)
    {
        try{
            $response = $this->campaignService->updateCampaign($request, $campaign);

            Log::debug("campaign update response in controller: ".json_encode($response));

            return $this->handleResponse($response, "Campaign is updated",false);
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try{
            $response = $this->campaignService->deleteUpload($id);

            return $this->handleResponse($response, "Campaign file has been deleted successfully");
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }

    public function storeUploads(Request $request)
    {
        try{
            $response = $this->campaignService->addCampaignUploads($request);

            return $this->handleResponse($response, "Campaign files been added successfully");
        } catch (\Exception $e){
            Log::error('Found Exception: ' . $e->getMessage() . ' [Script: ' . __CLASS__.'@'.__FUNCTION__ . '] [Origin: ' . $e->getFile() . '-' . $e->getLine() . ']');

            return $this->invalidResponse($this->exceptionMessage,500);
        }
    }
}
