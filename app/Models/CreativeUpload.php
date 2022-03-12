<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreativeUpload extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function campaign(){
        return $this->belongsTo(Campaign::class);
    }
}
